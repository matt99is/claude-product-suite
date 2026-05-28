# claude-product-suite

A Claude plugin bundling skills for product, design, and creative workflows.

## Installed skills

- **`figma-writing`** (v1). Safe write-side operations against the Figma MCP.
  Covers cloning frames, updating text while preserving design-system
  bindings, generating variants, and auto-layout-aware insertion. Surfaces
  warnings rather than silently swapping fonts or breaking style links.

Planned future skills (not yet implemented): user research, slide-deck
building, prototyping, and others.

## Layout

```
claude-product-suite/
├── .claude-plugin/plugin.json
├── skills/figma-writing/
│   ├── SKILL.md
│   ├── helpers/figma-helpers.js
│   ├── references/pitfalls.md
│   └── playbooks/
├── commands/figma-learn.md
├── tests/
├── docs/
└── package.json
```

Each skill is self-contained inside its own folder. Helpers, references,
and playbooks are scoped to the skill that uses them. Commands live at the
plugin root by Claude plugin convention.

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

Adding a sibling skill (e.g. `user-research`) is a clone-and-rename
operation against `skills/figma-writing/`. Each new skill includes:

- `SKILL.md` (router and guard)
- `references/pitfalls.md` (categorised gotchas in the same per-entry format)
- `playbooks/` (operation recipes)
- An optional `helpers/` folder if the skill has an execution surface
- A corresponding `/<skill-name>-learn` slash command at `commands/`

## Audience

Personal use, then shared with colleagues. Public distribution deferred.
