---
doc: prd
status: approved
---
# Notice Change Radar — Product Requirements

For caregivers comparing an original and revised school notice. Based on `scope.md > The Core Loop` and `The Unique Kernel`.

## The Core Journey
1. Open a single page and see two labelled notice fields and a sample button.
2. Paste or load an original and revised notice, then choose Compare notices.
3. See a clear summary of changed details and sentences, with old and new source passages beside each finding.
4. Check any uncertain findings, then copy the action card for personal use.

## Screens and Layout
One responsive page. Intro and two notice editors above a result section. On wide screens, notices sit side by side; on narrow screens, they stack. Result cards keep earlier and revised evidence together.

## Look and Feel
Calm, readable, paper-like direction is the implementation default pending the learner's visual preference. Clear type, restrained color, and distinct labels for confirmed textual changes versus items needing review.

## Features and Behavior

### Notice entry
Accept two pasted English notices. Provide a labelled, synthetic school-trip example. Never transmit notice text or persist it after the tab closes.

### Change review
Show additions, removals, and changed sentences. Promote explicit dates, times, money amounts, places, and instruction phrases into a scan-friendly review. Each finding quotes the actual source passage; inferred matches are marked for review. Identical text yields a clear no-change state.

### Action card
Produce a concise card from the revised notice's changed or added instructions. The caregiver can copy it. Keep uncertain details visibly qualified rather than claiming they are confirmed requirements.

## States and Boundaries
- Empty field: ask for both notices without comparing.
- Same notices: say no text changes found.
- Ambiguous or unsupported wording: show the textual change and ask the caregiver to verify it in source, without inventing a deadline or instruction.
- Very long input: cap each notice to a practical size and explain the limit.
- Clipboard failure: leave the card visible and tell the caregiver to select and copy it manually.

## Product Decisions
- Caregivers are the primary audience; the learner chose this for a clear action workflow.
- Pasted text and supplied samples are first; the learner chose this for reliability.
- The comparison must work without a paid API; optional AI is not required for the proof of concept.

## What We're Building
The full one-page journey above, a verified sample, responsive presentation, and copyable result.

## Deferred From the POC
Screenshot recognition, accounts, cloud history, reminders, and live AI.

## Non-Goals
No legal or official interpretation of school policy; no automatic action on the caregiver's behalf.

## Open Questions
The learner's visual preference may refine styling, without changing the core flow.
