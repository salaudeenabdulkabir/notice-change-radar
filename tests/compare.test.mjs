import assert from 'node:assert/strict';
import test from 'node:test';
import { compareNotices } from '../src/compare.js';
import { sample } from '../src/sample.js';

test('school trip example shows the changed times and new raincoat instruction', () => {
  const { findings, actions } = compareNotices(sample.old, sample.revised);
  assert.ok(findings.some(item => item.oldSource.includes('8:30 AM') && item.newSource.includes('7:45 AM')));
  assert.ok(findings.some(item => item.oldSource.includes('water bottle') && item.newSource.includes('raincoat')));
  assert.ok(actions.some(action => action.includes('raincoat')));
  assert.ok(actions.some(action => action.includes('7:45 AM')));
  assert.ok(findings.every(item => item.oldSource || item.newSource));
});

test('unchanged notice has no findings', () => {
  const text = 'The trip starts at 9:00 AM. Please bring lunch.';
  assert.equal(compareNotices(text, text).unchanged, true);
});

test('new deadline remains tied to the source wording', () => {
  const result = compareNotices('Payment is due by Friday 9 October.', 'Payment is due by Monday 12 October.');
  assert.equal(result.findings.length, 1);
  assert.match(result.findings[0].newSource, /Monday 12 October/);
});

test('ambiguous new wording is shown for review without fabricated detail', () => {
  const result = compareNotices('Meet at the school gate.', 'Meet at the new location.');
  assert.ok(result.findings.length);
  assert.ok(result.findings.every(item => item.confidence === 'review' || item.newSource === 'Meet at the new location.'));
  assert.ok(result.findings.every(item => !/\d{1,2}:\d{2}/.test(item.newSource)));
});

test('missing notice receives a useful error', () => {
  assert.throws(() => compareNotices('', 'New notice'), /both notices/i);
});
