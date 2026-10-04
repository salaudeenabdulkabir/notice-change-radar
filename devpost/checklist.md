---
doc: checklist
status: draft
build_mode: fast
---
# Notice Change Radar — Build Checklist

The user requested implementation of the approved Notice Change Radar plan. This build uses a compact fast-mode slice; automated verification is complete, while learner hands-on review remains open.

## Build Slices
- [x] **Source-backed notice comparison** — implemented browser-only entry, sample, sentence comparison, change cards, and copied action text. Verification: `npm test` and browser walk-through of the school-trip example. Commit: `Build Notice Change Radar proof of concept`.

## Hands-on Checkpoints
- [ ] Learner tries the school-trip example and one notice of their own (or a second synthetic notice), then reports anything confusing or incorrect.

## Final Review
- [ ] Learner reviews the running proof of concept and gives feedback.
- [ ] Any agreed changes are implemented, retested, and committed.
- [ ] Learner confirms the proof of concept is ready.

## Code Tour and App Map
- [x] `devpost/app-map.html` prepared with the main code locations and run path.
- [ ] Brief learning wrap-up with the learner, grounded in a real comparison result.

## Revisions
- The first live example showed the bus departure in findings but not in the action card. The action-card selection now includes changed times, dates, places, and costs; the example and test cover 7:45 AM.
