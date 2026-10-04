# Notice Change Radar

A small, browser-only proof of concept for parents and caregivers comparing an original school notice with a revision. It flags changed wording and keeps the earlier and revised source passages beside every finding.

## Try it

Requires Node.js 20 or later. No install, account, or API key is needed.

```sh
npm start
```

Open `http://localhost:4173`, choose **Load school trip example**, then **Compare notices**. You can also paste your own two English notices. Use **Copy card** to take a short list of revised details and instructions.

## What it does

- Compares sentences from two short notices and identifies changed, added, and removed text.
- Groups likely time, date, place, cost, and packing or instruction changes for quick review.
- Labels uncertain sentence pairings, always showing source wording instead of inventing facts.
- Keeps notice text in the browser's memory. It is not uploaded or saved.

The comparison is deliberately narrow. Similar sentences can be paired imperfectly, so a caregiver should check the quoted notices before acting. This is not an official interpretation of a school's instructions.

## Test

```sh
npm test
```

The tests cover the school trip example, changed deadline, identical notices, ambiguous wording, and missing input.

## Hackathon process

This new project was built with the [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics). The required planning documents are in [`devpost/`](devpost/). The supplied sample is synthetic; no real student data is included.

## License

MIT. See [LICENSE](LICENSE).
