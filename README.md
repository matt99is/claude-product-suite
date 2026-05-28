# claude-product-suite

A Claude plugin bundling skills for product, design, and creative workflows.

## Status

Pre-v1. Currently scoping the first skill: `figma-writing`. Design spec lives in [`docs/specs/`](docs/specs/).

## Planned skills

- `figma-writing`: safe write-side operations against the Figma MCP, with helpers for cloning, text updates preserving design-system bindings, and auto-layout-aware insertion. *First skill, in active design.*
- User research, slide decks, prototyping, and other product workflows will be added as siblings under `skills/`.

## Layout

```
claude-product-suite/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── figma-writing/
│       ├── SKILL.md
│       ├── helpers/
│       ├── references/
│       └── playbooks/
├── commands/
│   └── figma-learn.md
├── docs/
│   └── specs/
├── README.md
└── LICENSE
```

Each skill folder is self-contained (helpers, references, playbooks scoped to the skill that uses them). Commands live at the plugin root by Claude plugin convention.

## Audience

Personal use for now. Will be shared with colleagues. Public distribution deferred.
