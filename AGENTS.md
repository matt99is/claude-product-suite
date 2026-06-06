# AGENTS.md

This is the entry point for any AI agent working on this project. Read this file first, then follow the load order below before editing plugin files, skills, helpers, or tests.

---

## What this project is

claude-product-suite is a Claude plugin bundling product, design, and creative workflow skills. Current skills include `product-suite-router` for intent routing, `research` for brief-first source-led UX/product research, `figma-writing` for safe write-side Figma MCP operations such as cloning frames, updating text while preserving design-system bindings, generating variants, and inserting nodes in auto-layout frames, and `design-critique` for source-grounded UX critique of static design artefacts.

**Stack:** Claude plugin manifest, Markdown skills/playbooks, pure JavaScript helpers, Node.js built-in `node:test`

---

## Load order

Read these files before starting any task:

| Priority | File | Why |
|---|---|---|
| 1 - always | `README.md` | Project overview, layout, commands, and contribution shape |
| 2 - always | `skills/product-suite-router/SKILL.md` | Suite-level routing guard and capability map entry point |
| 3 - always | `skills/research/SKILL.md` | Current research skill router and evidence guard |
| 4 - always | `skills/figma-writing/SKILL.md` | Figma write-side router and safety guard |
| 5 - always | `skills/design-critique/SKILL.md` | Design critique router and artefact-only safety guard |
| 6 - always | `../vault/Projects/claude-product-suite.md` | Current status, decisions, gotchas, and next steps |
| 7 - always | `../vault/Patterns/vault-note-governance.md` | Rules for keeping the vault project note lean |
| 8 - before helper changes | `skills/figma-writing/helpers/figma-helpers.js` | Shared helper preamble pasted into Figma MCP calls |
| 8 - before pitfall/playbook changes | `skills/figma-writing/references/pitfalls.md` | Current failure-mode catalogue |
| 8 - before real Figma validation | `docs/hand-test-figma-helpers.md` | Manual validation flow for API-bound helpers |
| 8 - for historical design context | `docs/specs/2026-05-28-figma-writing-skill-design.md` | v1 design rationale |
| 8 - for historical implementation context | `docs/plans/2026-05-28-figma-writing-v1-implementation-plan.md` | v1 implementation plan |

---

## Startup Gate (Mandatory)

Before running commands, searching code, or editing files, every agent must load the always-required startup context:

1. Read this `AGENTS.md`.
2. Read `README.md`.
3. Read `skills/product-suite-router/SKILL.md`.
4. Read `skills/research/SKILL.md`.
5. Read `skills/figma-writing/SKILL.md`.
6. Read `skills/design-critique/SKILL.md`.
7. Read vault project note: `../vault/Projects/claude-product-suite.md`.
8. Read vault governance note: `../vault/Patterns/vault-note-governance.md`.
9. In the first response of the session, explicitly confirm these files were loaded.

Load other items from the table above only when their scope applies to the task.

If any step is missed, stop and complete it before continuing.

---

## Vault Note Contract (Anti-Bloat)

The vault project note at `../vault/Projects/claude-product-suite.md` is startup memory, not history.

### Fixed purpose

- Keep only current operating truth needed to start work quickly.
- Keep active decisions, current gotchas, and near-term next steps.
- Do not use it as a changelog, deploy log, or commit diary.

### Hard limits

- Max 220 lines.
- Max 14,000 characters.
- Required `##` sections:
  - `What it is`
  - `Current status`
  - `Active decisions`
  - `Known gotchas`
  - `Next steps`
  - `References`
- Bullet caps:
  - `Current status`: 12 bullets max
  - `Active decisions`: 8 bullets max
  - `Known gotchas`: 8 bullets max
  - `Next steps`: 6 bullets max
  - `References`: 12 bullets max

### Update rule

- Replace existing bullets when state changes; do not append chronological entries.
- Keep one bullet per capability/state, written as present tense current truth.
- Move durable history to repo docs.

### Archive policy

- Default: no rolling archive notes.
- Optional: one manual snapshot before major rewrites, only on explicit user request.

Validation command, from the vault repo root:

```bash
python3 scripts/check_vault.py --strict-missing
```

---

## Key commands

```bash
# Unit tests
npm test

# Syntax-check helper file
npm run check

# Local plugin marketplace install while repo remains private
/plugin marketplace add <absolute path to this local clone>
/plugin install claude-product-suite@claude-product-suite
```

---

## Critical gotchas

- No build step and no runtime dependencies are expected; keep helpers as plain JavaScript and tests on Node's built-in runner.
- `node --test tests/` does not work reliably here; use the package script, which expands to `node --test tests/*.test.js`.
- Research is deliberate, not a mandatory pre-step for prototype, deck, wireframe, or Figma requests. Route to research only when the user asks for evidence gathering, competitor/best-practice research, or source-led synthesis.
- NotebookLM support is only a paste-ready clean URL list in the portable research skill; do not require NotebookLM, vault paths, or private automation.
- The Figma plugin sandbox cannot import local modules. Helper code is pasted as a preamble into each write-side Figma MCP call.
- Helper result convention: hard failures throw; soft drift returns an envelope such as `{ ok, warnings, value }`.
- Never silently swap fonts, never change `textAutoResize` without an explicit reason, and match sibling text nodes by positional index rather than `pathKey`.
- Cloning a Figma node preserves bindings, but mutating styled properties under a binding can break them; use `setTextPreservingBindings` rather than bypassing it.
- API-bound helpers require the hand-test guide against a real Figma file; unit tests only cover pure-data helper behavior.

---

## Repo structure

```text
AGENTS.md                         # this file - LLM entry point
CLAUDE.md                         # thin Claude Code pointer to AGENTS.md
README.md                         # overview, layout, commands
package.json                      # npm scripts, private package metadata
.claude-plugin/
  plugin.json                     # plugin manifest
  marketplace.json                # local marketplace wrapper
commands/
  figma-learn.md                  # slash command for Figma learnings
  research-learn.md               # slash command for research learnings
skills/
  product-suite-router/
    SKILL.md                      # suite-level intent router
    references/                   # capability map and routing pitfalls
  research/
    SKILL.md                      # brief-first source-led research guard
    references/                   # source quality and research pitfalls
    playbooks/                    # research operation recipes
  figma-writing/
    SKILL.md                      # Figma write-side router and guard
    helpers/figma-helpers.js      # helper preamble for write-side Figma calls
    references/pitfalls.md        # categorized gotchas
    playbooks/                    # operation recipes
  design-critique/
    SKILL.md                      # artefact-only UX critique router and guard
    references/                   # source canon and critique principles
    playbooks/                    # critique operation recipes
tests/                            # Node test suite and Figma mocks
docs/
  hand-test-figma-helpers.md
  specs/
  plans/
  superpowers/
```
