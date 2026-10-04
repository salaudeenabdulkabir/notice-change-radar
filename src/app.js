import { compareNotices } from './compare.js';
import { sample } from './sample.js';

const oldInput = document.querySelector('#old-notice');
const newInput = document.querySelector('#new-notice');
const form = document.querySelector('#compare-form');
const results = document.querySelector('#results');
const status = document.querySelector('#status');
const sampleButton = document.querySelector('#load-sample');
const clearButton = document.querySelector('#clear-all');

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function setStatus(message, error = false) {
  status.textContent = message;
  status.className = error ? 'status error' : 'status';
}

function renderEvidence(label, source, fallback) {
  const block = element('div', 'evidence');
  block.append(element('span', 'evidence-label', label));
  block.append(element('p', source ? '' : 'muted', source || fallback));
  return block;
}

function renderFinding(finding, index) {
  const card = element('article', 'finding');
  const top = element('div', 'finding-top');
  top.append(element('span', 'category', finding.category));
  top.append(element('span', finding.confidence === 'review' ? 'badge review' : 'badge', finding.confidence === 'review' ? 'Check the source' : 'Likely pairing'));
  card.append(top);
  card.append(element('h3', '', `${String(index + 1).padStart(2, '0')} · ${finding.kind === 'added' ? 'Added' : finding.kind === 'removed' ? 'Removed' : 'Changed'}`));
  const pair = element('div', 'evidence-pair');
  pair.append(renderEvidence('Earlier notice', finding.oldSource, 'No matching sentence found'));
  pair.append(renderEvidence('Revised notice', finding.newSource, 'No matching sentence found'));
  card.append(pair);
  return card;
}

function buildCardText(data) {
  const lines = ['NOTICE CHANGE RADAR', 'Review these changes against the revised notice:'];
  if (data.actions.length) data.actions.forEach(action => lines.push(`• ${action}`));
  else lines.push('• No changed action sentence was identified. Review the changes below.');
  lines.push('', 'Other changes:');
  data.findings.filter(item => !data.actions.includes(item.newSource)).forEach(item => {
    lines.push(`• ${item.oldSource || '[not in earlier notice]'} → ${item.newSource || '[removed]'}`);
  });
  lines.push('', 'Check the original notices before acting.');
  return lines.join('\n');
}

function render(data) {
  results.replaceChildren();
  results.hidden = false;
  if (data.unchanged) {
    const empty = element('div', 'empty-result');
    empty.append(element('span', 'eyebrow', 'ALL CLEAR'));
    empty.append(element('h2', '', 'No text changes found.'));
    empty.append(element('p', '', 'These notices contain the same sentences. You can edit either notice and compare again.'));
    results.append(empty);
    return;
  }
  const header = element('div', 'results-heading');
  const heading = element('div');
  heading.append(element('span', 'eyebrow', 'YOUR UPDATE')); 
  heading.append(element('h2', '', `${data.findings.length} change${data.findings.length === 1 ? '' : 's'} worth a look`));
  heading.append(element('p', 'muted', 'Read each earlier and revised passage before you act. “Check the source” means the pairing may need your judgment.'));
  header.append(heading);
  results.append(header);

  const action = element('section', 'action-card');
  const actionHead = element('div', 'action-head');
  const label = element('div');
  label.append(element('span', 'eyebrow', 'NEXT STEP CARD'));
  label.append(element('h3', '', 'What needs attention now'));
  actionHead.append(label);
  const copy = element('button', 'copy-button', 'Copy card');
  copy.type = 'button';
  actionHead.append(copy);
  action.append(actionHead);
  const list = element('ul', 'action-list');
  (data.actions.length ? data.actions : ['No changed action sentence was identified. Review the changes below.']).forEach(text => list.append(element('li', '', text)));
  action.append(list);
  action.append(element('p', 'action-note', 'These are excerpts from the revised notice, not an official interpretation. Check the source before acting.'));
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(buildCardText(data)); copy.textContent = 'Copied'; setStatus('Action card copied.'); }
    catch { copy.textContent = 'Select text below'; setStatus('Clipboard unavailable. Select and copy the card text below.', true); const fallback = element('textarea', 'copy-fallback'); fallback.value = buildCardText(data); fallback.readOnly = true; action.append(fallback); fallback.select(); }
  });
  results.append(action);
  const grid = element('div', 'findings-grid');
  data.findings.forEach((item, index) => grid.append(renderFinding(item, index)));
  results.append(grid);
}

sampleButton.addEventListener('click', () => { oldInput.value = sample.old; newInput.value = sample.revised; results.hidden = true; setStatus('Example loaded. Compare the notices to see what changed.'); });
clearButton.addEventListener('click', () => { oldInput.value = ''; newInput.value = ''; results.hidden = true; setStatus('Notices cleared.'); oldInput.focus(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  try { const data = compareNotices(oldInput.value, newInput.value); render(data); setStatus(data.unchanged ? 'Comparison complete: no changes.' : 'Comparison complete. Review the source passages.'); results.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  catch (error) { results.hidden = true; setStatus(error.message, true); }
});
