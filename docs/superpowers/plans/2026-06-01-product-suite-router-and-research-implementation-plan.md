# Product Suite Router And Research Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a top-level product-suite router skill and a portable research skill that starts with a brief, evaluates sources, produces source-backed synthesis, and includes a clean URL list for optional NotebookLM use.

**Architecture:** The router skill is the suite's front door and only classifies intent. The research skill is the first solid specialist skill and owns brief-first research, source quality, synthesis, and research-specific learning. Tests use content contracts because skills are Markdown assets rather than runtime code.

**Tech Stack:** Claude Code plugin skills and commands, Markdown playbooks/references, Node.js built-in `node:test`, no runtime dependencies.

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-01-product-suite-router-and-research-design.md`
- Existing skill template: `skills/figma-writing/SKILL.md`
- Existing learning command template: `commands/figma-learn.md`
- Existing tests: `tests/*.test.js`

## File Structure

Create:

- `skills/product-suite-router/SKILL.md` - top-level intent router and guard.
- `skills/product-suite-router/references/capability-map.md` - implemented, partial, and future capability map.
- `skills/product-suite-router/references/routing-pitfalls.md` - routing mistakes and correct patterns.
- `skills/research/SKILL.md` - research skill router and guard.
- `skills/research/references/source-quality.md` - trust tiers, allowed use, and NotebookLM URL-list rule.
- `skills/research/references/research-pitfalls.md` - research failure modes.
- `skills/research/playbooks/brief-to-research-plan.md` - turn vague ask into research brief and plan.
- `skills/research/playbooks/source-led-research.md` - collect, assess, and synthesize sources.
- `skills/research/playbooks/evidence-synthesis.md` - synthesize supplied material without discovery.
- `skills/research/playbooks/competitor-scan.md` - competitor/example scan workflow.
- `commands/research-learn.md` - learning-loop command for research skill.
- `tests/skill-content-contracts.test.js` - file existence and content contract tests.

Modify:

- `README.md` - list router and research skill, note Figma is parked as existing partial capability.
- `AGENTS.md` - update project description and repo structure after implementation.
- `../vault/Projects/claude-product-suite.md` - update current status and next steps at the end, keeping the vault note contract.

Do not modify:

- `skills/figma-writing/helpers/figma-helpers.js`
- Existing Figma tests, except if a global test fixture unexpectedly requires it.

---

## Chunk 1: Content Contract Tests

### Task 1: Add failing tests for router and research assets

**Files:**

- Create: `tests/skill-content-contracts.test.js`

- [ ] **Step 1: Write failing content-contract tests**

Create `tests/skill-content-contracts.test.js`:

```js
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

async function read(path) {
  return await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('product-suite-router skill defines routing boundaries', async () => {
  const skill = await read('skills/product-suite-router/SKILL.md');

  assert.match(skill, /name:\s*product-suite-router/);
  assert.match(skill, /primary intent/i);
  assert.match(skill, /Do not automatically route/i);
  assert.match(skill, /research/i);
  assert.match(skill, /figma-writing/i);
  assert.match(skill, /future capability/i);
});

test('router references include capability map and pitfalls', async () => {
  const capabilityMap = await read('skills/product-suite-router/references/capability-map.md');
  const pitfalls = await read('skills/product-suite-router/references/routing-pitfalls.md');

  assert.match(capabilityMap, /Research/i);
  assert.match(capabilityMap, /Figma writing/i);
  assert.match(capabilityMap, /Wireframing/i);
  assert.match(capabilityMap, /Future/i);

  assert.match(pitfalls, /Over-routing/i);
  assert.match(pitfalls, /False capability/i);
  assert.match(pitfalls, /Chain inflation/i);
});

test('research skill enforces brief-first source-led workflow', async () => {
  const skill = await read('skills/research/SKILL.md');

  assert.match(skill, /name:\s*research/);
  assert.match(skill, /brief/i);
  assert.match(skill, /Never synthesise from memory/i);
  assert.match(skill, /source quality/i);
  assert.match(skill, /NotebookLM/i);
  assert.match(skill, /one URL per line/i);
});

test('research references define source trust and pitfalls', async () => {
  const sourceQuality = await read('skills/research/references/source-quality.md');
  const pitfalls = await read('skills/research/references/research-pitfalls.md');

  assert.match(sourceQuality, /Strong/i);
  assert.match(sourceQuality, /Medium/i);
  assert.match(sourceQuality, /Weak/i);
  assert.match(sourceQuality, /Weak.*Key Evidence/is);
  assert.match(sourceQuality, /one URL per line/i);

  assert.match(pitfalls, /Synthesising from memory/i);
  assert.match(pitfalls, /Weak sources carrying key claims/i);
  assert.match(pitfalls, /Vague brief/i);
});

test('research playbooks cover the first supported workflows', async () => {
  const briefPlan = await read('skills/research/playbooks/brief-to-research-plan.md');
  const sourceLed = await read('skills/research/playbooks/source-led-research.md');
  const synthesis = await read('skills/research/playbooks/evidence-synthesis.md');
  const competitor = await read('skills/research/playbooks/competitor-scan.md');

  assert.match(briefPlan, /What the research must inform/i);
  assert.match(sourceLed, /candidate sources/i);
  assert.match(sourceLed, /clean URL list/i);
  assert.match(synthesis, /supplied source/i);
  assert.match(competitor, /comparison dimensions/i);
});

test('research learning command requires approval before editing', async () => {
  const command = await read('commands/research-learn.md');

  assert.match(command, /Capture a new research learning/i);
  assert.match(command, /Show the draft to the user/i);
  assert.match(command, /Wait for approval/i);
  assert.match(command, /research-pitfalls/i);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: fail with `ENOENT` for `skills/product-suite-router/SKILL.md` or another missing new file.

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/skill-content-contracts.test.js
git commit -m "test: add product suite skill content contracts"
```

---

## Chunk 2: Product Suite Router Skill

### Task 2: Create router skill and references

**Files:**

- Create: `skills/product-suite-router/SKILL.md`
- Create: `skills/product-suite-router/references/capability-map.md`
- Create: `skills/product-suite-router/references/routing-pitfalls.md`

- [ ] **Step 1: Create `skills/product-suite-router/SKILL.md`**

Include this structure:

```markdown
---
name: product-suite-router
description: Use when a UX, product, design, research, Figma, wireframing, prototyping, slide-deck, or creative workflow request may need routing to a specialist skill. Classify primary intent before doing the work.
---

# product-suite-router

This skill is the routing layer for `claude-product-suite`. It classifies the
user's primary intent and routes to an implemented specialist skill when one
exists.

## Non-negotiables

1. Preserve the user's primary intent.
2. Do not automatically route deck, prototype, wireframe, or Figma requests through research.
3. Do not claim a future capability is implemented.
4. If evidence gathering is the user's goal, route to `research`.
5. If Figma mutation is the user's goal, route to `figma-writing`.
6. Ask one clarifying question when the request could mean research, synthesis, or artefact production.

## Pre-flight checklist

1. Identify the primary intent.
2. Check `references/capability-map.md`.
3. If a specialist exists, read that skill before work begins.
4. If no specialist exists, proceed with general assistance and name the gap plainly.
5. If the request might need research before another artefact, ask the user rather than assuming.

## Routing matrix

- Research, evidence gathering, competitor scan, trend scan, best-practice review -> `skills/research/SKILL.md`.
- Synthesis of supplied source material -> `skills/research/SKILL.md`, skipping source discovery.
- Figma write-side mutation -> `skills/figma-writing/SKILL.md`.
- Wireframes, prototypes, slide decks -> future specialist skills; use general assistance for now unless the user explicitly asks for research first.

## Verification

Before answering, check that the selected route still matches the user's output request.
```

- [ ] **Step 2: Create `references/capability-map.md`**

Include a Markdown table with capabilities from the spec:

- Research: implemented next.
- Evidence synthesis: implemented next.
- Figma writing: existing partial v1.
- Figma design-system-safe creation: future improvement.
- Wireframing: future.
- Prototyping: future.
- Slide decks: future.
- Product brief processing: future or research-adjacent.

- [ ] **Step 3: Create `references/routing-pitfalls.md`**

Use the same four-part pitfall entry format as `skills/figma-writing/references/pitfalls.md`.

Required entries:

- Over-routing research into every downstream task.
- Under-routing research asks into memory-based answers.
- False capability for future skills.
- Chain inflation.
- Ambiguous request treated as certain.

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: router tests pass; research tests still fail because research files are not created yet.

- [ ] **Step 5: Commit router skill**

```bash
git add skills/product-suite-router tests/skill-content-contracts.test.js
git commit -m "feat(skill): add product suite router"
```

---

## Chunk 3: Research Skill Core

### Task 3: Create research skill and references

**Files:**

- Create: `skills/research/SKILL.md`
- Create: `skills/research/references/source-quality.md`
- Create: `skills/research/references/research-pitfalls.md`

- [ ] **Step 1: Create `skills/research/SKILL.md`**

Include:

```markdown
---
name: research
description: Use when the user asks to research a subject, gather evidence, compare competitors, review best practices, scan a market or trend, or synthesize supplied sources into UX/product implications.
---

# research

This skill governs source-led research for UX and product work.

## Non-negotiables

1. Start with a useful brief before source collection.
2. Never synthesise from memory, source descriptions, or prior summaries as evidence.
3. Only use sources read in the current pass or supplied by the user.
4. Separate source-backed findings from analyst inference.
5. Weak sources must not carry key claims.
6. Always include a clean URL list when new external sources are used.
7. NotebookLM is optional; do not require it.

## Pre-flight checklist

1. Identify whether the task is new research or synthesis of supplied material.
2. If the ask is vague, use `playbooks/brief-to-research-plan.md`.
3. If collecting sources, read `references/source-quality.md`.
4. Pick the matching playbook.
5. Confirm the expected output shape with the user when stakes or scope are unclear.

## Default output shape

1. Brief recap
2. Executive summary
3. Key findings
4. Evidence table or source notes
5. UX/product implications
6. Risks, caveats, and confidence
7. Recommended next actions
8. Clean URL list

## Clean URL list rule

When external sources are used, end with a section containing one URL per line,
with no markdown labels, titles, bullets, or blank lines between entries.
```

- [ ] **Step 2: Create `source-quality.md`**

Include:

- Trust tiers: Strong, Medium, Weak.
- Allowed use: Key Evidence, Supporting Context, Examples Only, Exclude.
- Rule: Weak sources must never be Key Evidence.
- Source candidate rule: log serious candidates conceptually, but do not require file output unless the user asks for a bundle.
- Clean URL list format.

- [ ] **Step 3: Create `research-pitfalls.md`**

Required pitfall entries:

- Vague brief leads to unfocused research.
- Synthesising from memory.
- Weak sources carrying key claims.
- Source list not paste-ready for NotebookLM.
- Treating vendor opinion as independent evidence.
- Hiding inference as fact.

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: research core reference tests pass; playbook and command tests still fail.

- [ ] **Step 5: Commit research core**

```bash
git add skills/research tests/skill-content-contracts.test.js
git commit -m "feat(skill): add research core guidance"
```

---

## Chunk 4: Research Playbooks And Learning Command

### Task 4: Create research playbooks

**Files:**

- Create: `skills/research/playbooks/brief-to-research-plan.md`
- Create: `skills/research/playbooks/source-led-research.md`
- Create: `skills/research/playbooks/evidence-synthesis.md`
- Create: `skills/research/playbooks/competitor-scan.md`

- [ ] **Step 1: Create `brief-to-research-plan.md`**

Required sections:

- When to use
- What Claude needs first
- Brief fields
- Steps
- Common failures

The steps must include identifying "What the research must inform".

- [ ] **Step 2: Create `source-led-research.md`**

Required sections:

- When to use
- What Claude needs first
- Pre-flight reads
- Steps
- Common failures

The steps must include candidate sources, source quality classification, source-backed synthesis, and clean URL list.

- [ ] **Step 3: Create `evidence-synthesis.md`**

Required behavior:

- Use supplied source material.
- Skip source discovery unless the user asks for additional research.
- Identify gaps and confidence.
- Preserve citations or source references from supplied material.

- [ ] **Step 4: Create `competitor-scan.md`**

Required behavior:

- Define comparison dimensions before collecting examples.
- Separate direct product evidence from commentary.
- Produce UX/product implications, not just a feature table.

### Task 5: Create research learning command

**Files:**

- Create: `commands/research-learn.md`

- [ ] **Step 1: Create the command**

Mirror the flow of `commands/figma-learn.md`:

1. Identify the learning.
2. Classify it as new pitfall, refinement, playbook change, or output-format pattern.
3. Draft the entry.
4. Show the draft to the user and wait for approval.
5. Apply to `skills/research/references/` or `skills/research/playbooks/`.

Make sure the command includes the exact phrases `Show the draft to the user`,
`Wait for approval`, and `research-pitfalls` so the content contract passes.

- [ ] **Step 2: Run tests**

Run:

```bash
npm test
```

Expected: all content-contract tests pass.

- [ ] **Step 3: Commit playbooks and command**

```bash
git add skills/research/playbooks commands/research-learn.md tests/skill-content-contracts.test.js
git commit -m "feat(skill): add research playbooks and learning loop"
```

---

## Chunk 5: Project Docs And Final Verification

### Task 6: Update public project docs

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `../vault/Projects/claude-product-suite.md`

- [ ] **Step 1: Update `README.md`**

Change "Installed skills" to include:

- `product-suite-router`
- `research`
- `figma-writing`

Update planned future skills to keep wireframing, prototyping, slide decks, and deeper Figma improvement as future work.

- [ ] **Step 2: Update `AGENTS.md`**

Update:

- "What this project is" so it names router + research as the next architecture.
- Repo structure tree to include `skills/product-suite-router/`, `skills/research/`, and `commands/research-learn.md`.
- Critical gotchas to include: research should not be a mandatory pre-step for prototype/deck/Figma requests.

- [ ] **Step 3: Update the vault project note**

Edit `../vault/Projects/claude-product-suite.md` within its contract:

- Replace "first and currently only skill" with current truth once router/research exist.
- Add current status for router and research.
- Replace next step about scaffolding the next skill with a more specific next step about using/iterating research.
- Keep all bullet caps.

- [ ] **Step 4: Validate the vault**

From the vault root:

```bash
python3 scripts/check_vault.py --strict-missing
```

Expected: pass.

### Task 7: Final verification

**Files:**

- No new files unless verification reveals a small doc/test fix.

- [ ] **Step 1: Run all repo tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run helper syntax check**

```bash
npm run check
```

Expected: `node --check skills/figma-writing/helpers/figma-helpers.js` passes with no output beyond npm script header.

- [ ] **Step 3: Check git status**

```bash
git status --short
```

Expected: only intentional changes are present.

- [ ] **Step 4: Commit docs and final integration**

```bash
git add README.md AGENTS.md ../vault/Projects/claude-product-suite.md
git commit -m "docs: update product suite routing and research status"
```

If the plan execution uses separate commits from earlier chunks, this final commit should only contain docs/vault updates.

---

## Execution Notes

- Use the existing `figma-writing` skill as the format reference, not as a domain reference.
- Keep all skill Markdown portable. Do not hard-code `/home/matt99is`, vault paths, Telegram, or NotebookLM as requirements.
- NotebookLM should only appear as an optional destination for the clean URL list.
- Do not implement helper JavaScript for research in this phase.
- Do not add npm dependencies.
- Do not change Figma helper behavior.
