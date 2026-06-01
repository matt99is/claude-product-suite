# claude-product-suite

A Claude plugin bundling skills for product, design, and creative workflows.

## Installed skills

- **`product-suite-router`**. Top-level intent router for UX, product, design, research, Figma, wireframing, prototyping, slide-deck, and creative workflow requests. Routes to implemented specialist skills and names future capabilities honestly.
- **`research`**. Brief-first, source-led research for UX and product work. Covers evidence gathering, source quality, competitor scans, supplied-source synthesis, UX/product implications, and a clean URL list for optional NotebookLM use.
- **`figma-writing`** (v1). Safe write-side operations against the Figma MCP. Covers cloning frames, updating text while preserving design-system bindings, generating variants, and auto-layout-aware insertion. Surfaces warnings rather than silently swapping fonts or breaking style links.

Planned future skills or improvements live in [`docs/roadmap.md`](docs/roadmap.md). Near-term themes include Figma wireframing, user testing, brainstorming, high-fidelity prototyping, slide decks, and product brief processing.

## Layout

```
claude-product-suite/
├── .claude-plugin/plugin.json
├── skills/product-suite-router/
│   ├── SKILL.md
│   └── references/
├── skills/research/
│   ├── SKILL.md
│   ├── references/
│   └── playbooks/
├── skills/figma-writing/
│   ├── SKILL.md
│   ├── helpers/figma-helpers.js
│   ├── references/pitfalls.md
│   └── playbooks/
├── commands/
│   ├── figma-learn.md
│   └── research-learn.md
├── tests/
├── docs/
└── package.json
```

Each skill is self-contained inside its own folder. Helpers, references,
and playbooks are scoped to the skill that uses them. Commands live at the
plugin root by Claude plugin convention.

## Installation

From Claude Code CLI, install from GitHub with:

    /plugin marketplace add matt99is/claude-product-suite
    /plugin install claude-product-suite@claude-product-suite

For local development installs, use the local clone path instead:

    /plugin marketplace add <absolute path to this local clone>
    /plugin install claude-product-suite@claude-product-suite

To update after a new release is pushed to GitHub:

    /plugin update claude-product-suite

If update does not resolve the GitHub marketplace install, reinstall from the
registered marketplace:

    /plugin install claude-product-suite@claude-product-suite

Restart Claude Code after installing or updating the plugin. See
[`docs/release.md`](docs/release.md) for release and versioning rules.

## Development

Tests use Node's built-in `node:test` runner. No external dependencies.

```bash
npm test          # run unit tests
npm run check     # syntax-check the helpers file
```

Unit tests cover the two helpers with pure-data logic
(`matchTextNodesByIndex`, `insertChildSafe`). The remaining six helpers are
hand-tested against a real Figma file using the instructions in
[`docs/hand-test-figma-helpers.md`](docs/hand-test-figma-helpers.md).

## Adding a new skill

Adding a sibling skill follows the suite pattern established by the router, research, and Figma skills. Each new skill includes:

- `SKILL.md` (router and guard)
- `references/` (pitfalls, quality bars, examples, or constraints)
- `playbooks/` (operation recipes)
- An optional `helpers/` folder if the skill has an execution surface
- A corresponding `/<skill-name>-learn` slash command at `commands/`

## Learning loops

Learning commands are local by default. Public users can capture preferences,
pitfalls, and workflow refinements into their own local skillset without editing
this plugin or creating git commits. Maintainer improvements to
`claude-product-suite` happen as normal project work in this repository: propose
the source change, get approval, update files, run tests, and create a local
commit only when requested. Learning commands never push to GitHub by default.

## Audience

Personal use, then shared with colleagues. Public distribution deferred.
