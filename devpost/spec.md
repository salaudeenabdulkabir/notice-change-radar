---
doc: spec
status: approved
---
# Notice Change Radar — Technical Spec

## How This Works, In Plain Language
The entire app runs in the browser. It splits both notices into readable lines and sentences, finds what stayed the same and what changed, and looks for explicit detail patterns. It then places every finding next to its original wording. No notice is uploaded or saved.

## The Core Journey Through the System
The user loads or pastes two notices → the comparison module aligns their sentences → the extraction module labels explicit details → the page renders source-backed findings → the user copies the action card. Implements `prd.md > The Core Journey`.

## Stack
Plain HTML, CSS, and JavaScript modules. No runtime dependencies or API key. This keeps setup and judge access simple. Modern browser APIs provide clipboard access, with manual-copy fallback. For local hosting, Node.js 24 can run `server.mjs`. [Node documentation](https://nodejs.org/api/http.html), [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

## Where It Runs and How Someone Tries It
From the project root run `node server.mjs`, then open `http://localhost:4173`. Click “Load school trip example,” then “Compare notices.” No key or account is required. A public repo and short video are required for hackathon submission; deployment is optional.

## Look and Feel
Paper-like warm neutral background, dark ink text, blue for revised information, and amber for review items. Spacious, readable cards; responsive two-column entry.

## Components

### Notice editor
Two text areas, sample loading, character feedback, and submit validation. Implements `prd.md > Notice entry`.

### Comparison engine
Normalize whitespace, split into source-preserving sentences, align similar sentences, classify inserted/deleted/edited text, and find explicit detail patterns. The output never contains text absent from the notices. Implements `prd.md > Change review`.

### Result view and action card
Render findings with old and new evidence, provide no-change and review states, assemble changed new instructions, and copy them. Implements `prd.md > Change review` and `Action card`.

## Data Model
Transient in-memory `{oldText,newText}`. Each finding has `{kind,category,oldSource,newSource,confidence}`. Nothing persists when the tab closes.

## File Structure
```
notice-change-radar/
├── index.html            # one-page interface
├── styles.css            # responsive visual design
├── src/
│   ├── app.js            # interaction and rendering
│   ├── compare.js        # sentence alignment and extraction
│   └── sample.js         # synthetic demo notices
├── tests/compare.test.mjs
├── server.mjs            # local static server
├── devpost/              # skill-pack planning and build record
├── README.md
└── LICENSE
```

## External Services and Dependencies
None for the proof of concept. Optional AI wording is deferred unless a server-side key is available after the core works; its absence cannot block use.

## Important Failure Modes
- Ambiguous sentence alignment → show old and new text with a review label.
- Missing explicit detail → keep it as a textual change; do not invent a structured fact.
- Clipboard unavailable → keep the card selectable and display manual-copy guidance.

## What Was Simplified and Why
Pasted text instead of screenshot reading; browser-only processing instead of accounts or a backend. These choices preserve the source-backed comparison and make the demo reliable.

## Decisions and Open Issues
The learner selected the audience, pasted input, and key-free reliability. Plain JavaScript and the exact matching rules are implementation details derived from those choices. The visual direction may be refined from learner feedback. No other consequential technical uncertainty was identified.
