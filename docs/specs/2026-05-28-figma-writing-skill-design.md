# claude-product-suite, Figma-Writing Skill — Design Spec

**Date:** 2026-05-28
**Status:** Design approved, pending spec review before implementation planning

## Overview

`claude-product-suite` is a single Claude plugin that bundles a growing set of skills which improve Claude's ability to perform creative, design, and product workflows. Intended skill areas include working in Figma, performing user research, building slide decks, and others to be added over time.

The first skill in the plugin is `figma-writing`. It encodes hard-won safe defaults for writing changes back into Figma via the official Figma MCP server, and ships a small set of higher-level operations that handle the irreducible pitfalls correctly. Future skills will follow the same internal shape and live as siblings under `skills/`.

The plugin is initially for personal use, then shared with colleagues. Public distribution is deferred until later.

## Goals

For the plugin overall:

- Provide a single installable surface that gathers the user's evolving product and design skills under one Claude plugin.
- Establish a skill template that future siblings (user research, slide decks, prototyping) can adopt without redesign.

For the first skill, `figma-writing`:

- Encode the safe write-side defaults for Figma so Claude follows them without rediscovery.
- Provide higher-level operations for the most common write tasks: clone a frame, update text while preserving design-system bindings, generate variants.
- Use auto-layout correctly, with explicit positional insertion rather than `appendChild` defaults.
- Capture iterative learnings, especially around auto-layout, into a structured place so the skill gets better with use.

## Non-goals

- Critique workflow for Figma (screenshot, read, suggest). Out of v1 scope, may be a later skill in the same plugin.
- Read-side Figma helpers beyond what writes need. Reading via `get_design_context`, `get_metadata`, `get_variable_defs` continues to use the MCP directly.
- Coverage of the Figma desktop MCP. All writes target the cloud renderer via `use_figma`.
- Distribution via the official Figma plugin store. This is a Claude plugin, not a Figma plugin.
- Other skill areas (user research, slide decks, etc.) in v1. Their place in the plugin is reserved, their content lands later.

## Form factor decision

Chosen approach: one Claude plugin containing many skills. The first skill bundles a SKILL.md, a helper library, structured pitfalls and playbooks references, and is supported by a learn-loop slash command at the plugin level.

Two alternatives were considered and rejected:

1. *Skill-only.* All rules, defaults, and snippets inline in SKILL.md, no helper file. Rejected because Claude would retype helper functions every call, and paraphrase-drift on safety-critical patterns is the failure mode we are trying to avoid.
2. *One plugin per skill area, a marketplace of siblings.* Rejected because the user's intent is a single installable plugin that grows over time, not a marketplace of independently versioned plugins. One plugin keeps install surface minimal and lets future skills be added by adding a folder, not publishing a new package.

## Plugin structure

```
claude-product-suite/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── figma-writing/
│   │   ├── SKILL.md
│   │   ├── helpers/
│   │   │   └── figma-helpers.js
│   │   ├── references/
│   │   │   └── pitfalls.md
│   │   └── playbooks/
│   │       ├── clone-frame-with-text-updates.md
│   │       └── generate-variants-from-source.md
│   └── (future: user-research/, slide-decks/, prototyping/, ...)
├── commands/
│   ├── figma-learn.md
│   └── (future: user-research-learn.md, slide-decks-learn.md, ...)
├── README.md
└── LICENSE
```

Each skill is self-contained inside its own folder. Helpers, references, and playbooks are scoped to the skill that uses them. Commands sit at the plugin root because Claude plugin convention places them there.

The skill template applies to every skill that goes into this plugin: a SKILL.md as router and guard, an optional `helpers/` folder for skills with an execution surface, a `references/` folder for the structured pitfalls catalogue, and a `playbooks/` folder for operation recipes. Skills without an execution surface (for example, a future tone-of-voice skill) omit the helpers folder.

## Skill design (`skills/figma-writing/SKILL.md`)

The skill is a router and a guard. It activates on Figma write intent, routes Claude to the right pre-flight reads, and mandates the helper-preamble pattern.

**Frontmatter:**

```yaml
---
name: figma-writing
description: Use when modifying, cloning, or generating Figma nodes via the MCP, covering
  cloning components, updating text while preserving design-system bindings, generating
  variants, and any use_figma call that mutates the file. Read this before writing JS
  for use_figma.
---
```

**Body, in order:**

1. **Non-negotiables.** Short declarative rules. Loaded every time the skill activates. Approximately ten lines covering: never set `characters` without loading the current `fontName`, never break a binding without re-applying it, never use pathKeys for sibling instances, never trust the API response alone, never change `textAutoResize` without a reason.
2. **Pre-flight checklist.** Identify operation type, read the matching playbook, read the relevant pitfalls sections, confirm font availability for text operations.
3. **Script-writing pattern.** Paste `skills/figma-writing/helpers/figma-helpers.js` as the preamble of every write-side `use_figma` call. Call helpers by name, do not re-implement. For auto-layout-affected mutations, screenshot the parent frame, not just the mutated node.
4. **Verification.** Screenshot after the final mutation in a sequence. If the screenshot does not match intent, screenshot intermediate states to localise the failure. This rule may be tightened later if drift is observed.
5. **Learning loop.** Pointer to `/figma-learn` for capturing new failure modes mid-session.

The skill is a router, not an encyclopaedia. Target length around 150 lines.

## Helpers library design (`skills/figma-writing/helpers/figma-helpers.js`)

A single JavaScript file pasted as the preamble of every write-side `use_figma` call. The file holds seven core helpers and one supporting utility, eight functions in total.

**Core helpers:**

- `loadFontForNode(node)`. Reads the node's current `fontName`, calls `figma.loadFontAsync`. Returns `{ font, fallback, warnings }`. Never silently swaps to a different family.
- `snapshotStyleProfile(node)`. Captures `textStyleId`, `fillStyleId`, `boundVariables`, and local overrides that do not survive a style re-apply (`textDecoration`, `textCase`, `lineHeight`, `letterSpacing`). Returns a plain object.
- `applyStyleProfile(node, profile)`. Re-applies a profile. Uses `setTextStyleIdAsync` if available, falls back to sync. Re-applies overrides after the style, in that order.
- `setTextPreservingBindings(node, newText)`. Composes snapshot, font load, set characters, re-apply snapshot. Does not touch `textAutoResize`. Returns `{ ok, warnings }`.
- `cloneAndRebind(source, parent, insertIndex)`. Clones a node, inserts it via the auto-layout-safe path, verifies bindings survived the clone.
- `insertChildSafe(parent, index, node)`. Wraps `insertChild`. If `index` is omitted and `parent` is auto-layout, falls back to end-of-flow with a warning rather than silently using `appendChild`.
- `matchTextNodesByIndex(sourceParent, targetParent)`. Returns `[[srcText, tgtText], ...]` pairs matched by positional index within their parent. Replaces pathKey-based matching for sibling-instance safety.

**Supporting utility:**

- `getTextStyleIdCompat(node)`. Tries `getTextStyleIdAsync`, falls back to the sync property. Used internally by `snapshotStyleProfile`, exported for direct use.

**Result envelope convention:**

Hard failures throw. Soft issues (font fallback, auto-layout fallback, missing optional binding) return `{ ok: true, warnings: [...], value }`. This lets Claude surface non-fatal drift to the user rather than swallowing it.

**Composition pattern:**

Every write-side `use_figma` script has the helper file pasted as the preamble (approximately 200 lines), followed by 5 to 20 lines of operation-specific code calling the helpers by name. The token cost of the preamble is accepted in exchange for a lower error rate.

**Sandbox constraint:**

The `use_figma` sandbox does not support `import`. Pasting is the only delivery mechanism for now.

## Pitfalls reference design (`skills/figma-writing/references/pitfalls.md`)

A structured catalogue of traps Claude consults pre-flight. The skill names the relevant sections per operation type, so Claude reads only what is needed.

**Categories in v1, pre-populated from the original brief:**

- Fonts
- Design-system bindings
- Sibling instances with identical paths
- Auto-layout
- Text wrapping
- Progress arcs
- API quirks (async vs sync getters, page navigation)
- Verification

**Per-entry format, identical across the file:**

```markdown
### Symptom
What looks wrong. The thing visible in a screenshot or runtime error.

### Cause
Why it happens. One or two sentences.

### Correct pattern
What to do instead. References the helper if one exists, otherwise the manual steps.

### When this matters
Which operations this surfaces in.
```

Target length for v1: 300 to 500 lines. The file grows from this seed through the `/figma-learn` flow.

## Playbooks design (`skills/figma-writing/playbooks/`)

Step-by-step recipes for whole operations. Each playbook glues helpers and pitfalls into a workflow Claude can follow start to finish.

**v1 ships two playbooks:**

1. `clone-frame-with-text-updates.md`. Duplicate a frame and change text in the clone while preserving every design-system link.
2. `generate-variants-from-source.md`. Given a source frame and a list of text changes, produce N variants. A loop over the first playbook with positioning logic.

**Per-playbook format:**

```markdown
# <Operation title>

## When to use
One sentence on the trigger.

## What Claude needs first
What inputs Claude should confirm with the user before writing the script.

## Pre-flight reads
- pitfalls.md sections to consult
- Helpers that will be used

## Steps
Numbered list. Each step is one observable action.

## Common failures
Known failure modes for this operation, with the symptom and the recovery.
```

The reference graph is one-way: playbooks reference helpers and pitfalls, never the other direction.

## `/figma-learn` command design (`commands/figma-learn.md`)

A slash command for capturing new learnings about Figma writing cleanly during a session. It lives at the plugin root because Claude plugin convention places commands there. Every future skill that needs a learning loop will add its own sibling command (for example, `commands/user-research-learn.md`).

**Flow:**

1. **Identify the learning.** If not supplied as args, Claude asks: *"What did you learn? Phrase it as a symptom or a rule."*
2. **Classify.** New pitfall, refinement of an existing pitfall, new playbook stub, or helper TODO.
3. **Draft the entry** in the appropriate format.
4. **Show it to the user.** Wait for approval or edits.
5. **Apply.** Append to or edit the right file under `skills/figma-writing/`. Helper changes are flagged as TODOs rather than auto-applied, because helper code changes need real diffs and tests.
6. **Suggest a commit message.** Format: `learn(figma): <one-line summary>`. Versioning is part of the loop.

This keeps the pitfalls file a curated archive rather than a dumping ground.

## v1 scope

Ships with:

- Plugin scaffolding: `plugin.json`, `README.md`, `LICENSE`.
- The `figma-writing` skill folder populated with:
  - `SKILL.md`, approximately 150 lines.
  - `helpers/figma-helpers.js`, the eight functions above, approximately 200 lines.
  - `references/pitfalls.md`, pre-populated with all categories listed in the original brief.
  - `playbooks/clone-frame-with-text-updates.md` and `playbooks/generate-variants-from-source.md`.
- `commands/figma-learn.md` slash command.

Out of v1, deferred:

- `setProgressArc` helper. Lower frequency than text and clone operations.
- A variant generation helper. The playbook composes existing helpers, no new code needed.
- `setCurrentPageSafe` helper. Easy to inline when needed.
- Tightened screenshot policy. Current rule is screenshot after the final mutation, with intermediate screenshots only on mismatch.
- Any other skill area (user research, slide decks, prototyping, etc.). Their folders are not created in v1.

## Skill template generalisation

The structural shape established by `figma-writing` is intended to be reused for every future skill in the plugin. The template is:

- A SKILL.md at `skills/<skill-name>/SKILL.md` as router and guard.
- A `references/pitfalls.md` with categorised entries in the same per-entry format.
- A `playbooks/` folder with the same per-playbook format.
- A `/<skill-name>-learn` slash command at `commands/`, following the same five-step flow.
- A `helpers/` folder for skills with an execution surface (slide decks, prototyping). Skills without one (user research note-taking, tone of voice) omit it.

Adding a future skill is a clone-and-rename operation against the figma-writing folder, followed by populating the domain content.

## Repository

- Repo name: `claude-product-suite`.
- Local path: `/Users/matthewlelonek/Projects/claude-product-suite`.
- Visibility: private. Flip to public when the user is ready to share publicly.
- Initial audience: personal use, then shared with colleagues.

## Open questions

- Helper file token cost. Approximately 200 lines per `use_figma` call is acceptable for v1. If it becomes a real cost driver, options include trimming the helper set or shipping a minified variant.
- Screenshot policy. Soft rule for v1, revisit if drift is observed.
- Helper TODO surfacing. The `/figma-learn` flow flags helper changes as TODOs, but does not specify where the TODO list lives. To be decided during implementation.
