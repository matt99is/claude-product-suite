# claude-product-suite

A Claude plugin that provides a modular toolbox of product, design, research, testing, communication, and creative workflow skills for product teams. The suite is meant to be useful throughout product discovery, design exploration, delivery, testing, writing, and iteration without forcing a prescribed lifecycle or single process.

Skills can be used independently or combined when a user asks for a multi-step workflow. The router should preserve the user chosen job-to-be-done, route to implemented specialist skills, and name future capabilities honestly.

## Installed skills

- **`product-suite-router`**. Top-level intent router for UX, product, design, research, Contentsquare analytics, Figma, wireframing, prototyping, slide-deck, testing, strategy, and creative workflow requests. Routes to implemented specialist skills without forcing a product lifecycle.
- **`research`**. Brief-first, source-led research for UX and product work. Covers evidence gathering, source quality, competitor scans, supplied-source synthesis, UX/product implications, and a clean URL list for optional NotebookLM use.
- **`contentsquare-analysis`**. Contentsquare-only analysis support for clarifying CS questions, checking MCP capability, validating mappings, page groups, segments, funnels, zones, errors, and producing standardised stakeholder or analyst outputs.
- **`figma-writing`** (v1). Safe write-side operations against write-capable Figma MCP tools. Covers setup and permission checks, cloning frames, updating text while preserving design-system bindings, generating variants, auto-layout-aware insertion, design-system-safe frame and component creation, and editable table/chart/graph guidance. Surfaces warnings rather than silently swapping fonts, breaking style links, or inventing unavailable design-system assets.
- **`design-critique`**. Source-grounded UX critique of static design artefacts such as screenshots, Figma frames, mockups, and wireframes. Covers context-first review, severity-ranked findings, visual accessibility checks, and optional research escalation.
- **`usertesting`**. UserTesting.com workflow support for audience and screener definition, concise low-bias unmoderated test scripts, platform-realistic task/question blocks, export guidance, and compact qualitative synthesis with visuals where useful.
- **`brainstorming`**. Product/design/creative ideation support for shaping fuzzy ideas, generating concepts, comparing options, narrowing directions, and creating lightweight handoffs without over-routing research, critique, testing, or Figma work.
- **`writing-style`**. Plain-language drafting and rewrite support for product, design, research, stakeholder, marketing, and general communication. Scrubs common AI tropes, including em dash dependence, `not just X, but Y`, rule of three cadence, glossy transitions, and vague uplift language.

Planned future skills or improvements live in [`docs/roadmap.md`](docs/roadmap.md). The roadmap is organised as toolbox areas for product teams: thinking and strategy, evidence and discovery, design quality, making artefacts, testing and iteration, and communication.



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
├── skills/contentsquare-analysis/
│   ├── SKILL.md
│   ├── references/
│   └── playbooks/
├── skills/figma-writing/
│   ├── SKILL.md
│   ├── helpers/figma-helpers.js
│   ├── references/pitfalls.md
│   ├── references/setup-and-permissions.md
│   └── playbooks/
├── skills/design-critique/
│   ├── SKILL.md
│   ├── references/
│   └── playbooks/
├── skills/usertesting/
│   ├── SKILL.md
│   ├── references/
│   └── playbooks/
├── skills/brainstorming/
│   ├── SKILL.md
│   ├── references/
│   └── playbooks/
├── skills/writing-style/
│   ├── SKILL.md
│   ├── references/
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

Tests use Node built-in `node:test` runner. No external dependencies.

```bash
npm test          # run unit tests
npm run check     # syntax-check the helpers file
```

Unit tests cover the two helpers with pure-data logic
(`matchTextNodesByIndex`, `insertChildSafe`). The remaining six helpers are
hand-tested against a real Figma file using the instructions in
[`docs/hand-test-figma-helpers.md`](docs/hand-test-figma-helpers.md).

## Adding a new skill

Adding a sibling skill follows the suite pattern established by the router, research, Figma, and design critique skills. Each new skill includes:

- `SKILL.md` (router and guard)
- `references/` (pitfalls, quality bars, examples, or constraints)
- `playbooks/` (operation recipes)
- An optional `helpers/` folder if the skill has an execution surface
- A corresponding `/<skill-name>-learn` slash command at `commands/` when a learning loop is useful

New skills should add a useful specialist tool to the product-team toolbox. They should not assume users must follow a fixed process before using them. UserTesting.com workflows are handled by `skills/usertesting/` when the job is study planning, script review, export guidance, or results synthesis. Product/design ideation and concept shaping are handled by `skills/brainstorming/`. Writing, editing, rewrite, tone, voice, copy, prose, and AI trope scrubbing are handled by `skills/writing-style/`.

## Learning loops

Learning commands are local by default. Public users can capture preferences,
pitfalls, and workflow refinements into their own local skillset without editing
this plugin or creating git commits. Maintainer improvements to
`claude-product-suite` happen as normal project work in this repository: propose
the source change, get approval, update files, run tests, and create a local
commit only when requested. Learning commands never push to GitHub by default.

## Audience

Personal use, then shared with colleagues. Public distribution deferred.
