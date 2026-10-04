const MAX_LENGTH = 12000;

export function splitSentences(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n+/)
    .flatMap(line => line.match(/[^.!?]+(?:[.!?]+|$)/g) || [])
    .map(sentence => sentence.trim())
    .filter(Boolean);
}

function normalized(text) {
  return text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function tokens(text) {
  return new Set(normalized(text).split(/\s+/).filter(Boolean));
}

function similarity(a, b) {
  const one = tokens(a);
  const two = tokens(b);
  const overlap = [...one].filter(word => two.has(word)).length;
  return overlap / Math.max(one.size, two.size, 1);
}

function categoryFor(oldSource, newSource) {
  const both = `${oldSource} ${newSource}`;
  if (/\b(bring|pack|wear|take with|need to carry)\b/i.test(both)) return 'What to bring';
  if (/(?:[$£€]\s?\d|\b(?:cost|fee|payment|pay)\b)/i.test(both)) return 'Cost';
  if (/\b(?:arrive|leave|depart|return|start|finish|time)\b/i.test(both) || /\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/i.test(both)) return 'Time';
  if (/\b(?:location|venue|meet at|at the|school gate|entrance|hall|museum)\b/i.test(both)) return 'Place';
  if (/\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\b|\b\d{1,2}[/-]\d{1,2}\b/i.test(both)) return 'Date';
  if (/\b(?:please|must|should|required|remember|complete|submit|sign|collect)\b/i.test(both)) return 'Instruction';
  return 'Other change';
}

function isAction(text) {
  return /\b(?:please|must|should|required|bring|pack|wear|arrive|pay|payment|submit|sign|collect|leave|depart|return)\b/i.test(text);
}

export function compareNotices(oldText, newText) {
  if (!oldText.trim() || !newText.trim()) throw new Error('Paste both notices before comparing.');
  if (oldText.length > MAX_LENGTH || newText.length > MAX_LENGTH) throw new Error('Each notice must be 12,000 characters or fewer.');

  const oldSentences = splitSentences(oldText);
  const newSentences = splitSentences(newText);
  if (!oldSentences.length || !newSentences.length) throw new Error('Both notices need readable text.');

  const oldUsed = new Set();
  const newUsed = new Set();
  for (let j = 0; j < newSentences.length; j++) {
    const match = oldSentences.findIndex((old, i) => !oldUsed.has(i) && normalized(old) === normalized(newSentences[j]));
    if (match >= 0) { oldUsed.add(match); newUsed.add(j); }
  }

  const candidates = [];
  for (let i = 0; i < oldSentences.length; i++) {
    if (oldUsed.has(i)) continue;
    for (let j = 0; j < newSentences.length; j++) {
      if (newUsed.has(j)) continue;
      const score = similarity(oldSentences[i], newSentences[j]);
      if (score >= 0.38) candidates.push({ i, j, score });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  const findings = [];
  for (const { i, j, score } of candidates) {
    if (oldUsed.has(i) || newUsed.has(j)) continue;
    oldUsed.add(i); newUsed.add(j);
    findings.push({
      kind: 'changed', category: categoryFor(oldSentences[i], newSentences[j]),
      oldSource: oldSentences[i], newSource: newSentences[j],
      confidence: score >= 0.55 ? 'clear' : 'review', order: j,
    });
  }
  oldSentences.forEach((sentence, i) => {
    if (!oldUsed.has(i)) findings.push({ kind: 'removed', category: categoryFor(sentence, ''), oldSource: sentence, newSource: '', confidence: 'review', order: newSentences.length + i });
  });
  newSentences.forEach((sentence, j) => {
    if (!newUsed.has(j)) findings.push({ kind: 'added', category: categoryFor('', sentence), oldSource: '', newSource: sentence, confidence: 'review', order: j });
  });
  findings.sort((a, b) => a.order - b.order);

  const actions = findings
    .filter(item => item.newSource && (isAction(item.newSource) || ['Time', 'Date', 'Place', 'Cost', 'What to bring'].includes(item.category)))
    .map(item => item.newSource);
  return { findings, actions, unchanged: findings.length === 0 };
}
