# Contentsquare Analysis Skill Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `contentsquare-analysis` specialist skill to `claude-product-suite` for rigorous, repeatable Contentsquare analysis and standardised CS reporting.

**Architecture:** Add one self-contained skill folder with a lean router `SKILL.md`, focused references, and playbooks. Update the suite router, capability map, README, roadmap, manifests, and content-contract tests so the skill is discoverable without changing existing research, critique, Figma, UserTesting.com, or brainstorming routes.

**Tech Stack:** Markdown skills and references, Claude plugin manifest JSON, Node built-in `node:test`, no runtime dependencies.

---

## Source Spec

Read first:

- `docs/superpowers/specs/2026-06-29-contentsquare-analysis-skill-design.md`
- `AGENTS.md`
- `skills/product-suite-router/SKILL.md`
- `skills/product-suite-router/references/capability-map.md`
- `tests/skill-content-contracts.test.js`

## File Structure

Create:

- `skills/contentsquare-analysis/SKILL.md`: trigger rules, non-negotiables, pre-flight checklist, mode router, default output shape, verification.
- `skills/contentsquare-analysis/references/contentsquare-platform.md`: Contentsquare entities, MCP capability checks, UI-vs-MCP limits, and CS-specific validation pitfalls.
- `skills/contentsquare-analysis/references/project-workspace-contract.md`: expected external project files and fallback behaviour when missing.
- `skills/contentsquare-analysis/references/output-style.md`: standard finding/report structure and caveat style.
- `skills/contentsquare-analysis/playbooks/question-to-analysis-plan.md`: clarify ask, load context, define evidence plan.
- `skills/contentsquare-analysis/playbooks/funnel-and-journey-analysis.md`: funnels, journeys, optional steps, segment/device validation.
- `skills/contentsquare-analysis/playbooks/page-and-segment-analysis.md`: page, journey, device, audience, and segment comparison.
- `skills/contentsquare-analysis/playbooks/zone-analysis.md`: zoning/component interaction workflow and UI handoff.
- `skills/contentsquare-analysis/playbooks/error-impact-analysis.md`: error failure-mode, abandoner, recovery, and modelled-impact checks.
- `skills/contentsquare-analysis/playbooks/launch-impact-analysis.md`: release-register-led launch/change analysis.
- `skills/contentsquare-analysis/playbooks/stakeholder-summary.md`: concise stakeholder and analyst output workflow.

Modify:

- `skills/product-suite-router/SKILL.md`: add routing to `contentsquare-analysis` and protect existing routes.
- `skills/product-suite-router/references/capability-map.md`: add Contentsquare analysis as implemented in evidence/iteration.
- `skills/product-suite-router/references/routing-pitfalls.md`: add pitfalls for analytics-overreach and false platform generality.
- `README.md`: list the new installed skill and update layout.
- `docs/roadmap.md`: mark Contentsquare analysis as implemented or active in evidence/iteration.
- `tests/skill-content-contracts.test.js`: add content checks for the skill and router updates.
- `.claude-plugin/plugin.json`: update description and version.
- `package.json`: update version to match plugin manifest.

Do not create helper scripts for v1. The execution surface is the Contentsquare MCP plus project-local notes, not a deterministic local helper.

---

## Chunk 1: Content Contract Tests First

### Task 1: Add failing tests for the new skill contract

**Files:**

- Modify: `tests/skill-content-contracts.test.js`

- [ ] **Step 1: Add a failing test for `contentsquare-analysis` skill files**

Append a test block near the other skill tests:

```js
test('contentsquare analysis skill enforces CS-only rigorous workflow', async () => {
  const skill = await read('skills/contentsquare-analysis/SKILL.md');
  const platform = await read('skills/contentsquare-analysis/references/contentsquare-platform.md');
  const workspace = await read('skills/contentsquare-analysis/references/project-workspace-contract.md');
  const output = await read('skills/contentsquare-analysis/references/output-style.md');
  const plan = await read('skills/contentsquare-analysis/playbooks/question-to-analysis-plan.md');
  const funnel = await read('skills/contentsquare-analysis/playbooks/funnel-and-journey-analysis.md');
  const zones = await read('skills/contentsquare-analysis/playbooks/zone-analysis.md');
  const errors = await read('skills/contentsquare-analysis/playbooks/error-impact-analysis.md');
  const launch = await read('skills/contentsquare-analysis/playbooks/launch-impact-analysis.md');
  const summary = await read('skills/contentsquare-analysis/playbooks/stakeholder-summary.md');

  assert.match(skill, /name:\s*contentsquare-analysis/);
  assert.match(skill, /Contentsquare-only/i);
  assert.match(skill, /MCP capability/i);
  assert.match(skill, /project-local context/i);
  assert.match(skill, /observation.*interpretation.*recommendation.*next check.*caveat/is);

  assert.match(platform, /mappings/i);
  assert.match(platform, /page groups/i);
  assert.match(platform, /segments/i);
  assert.match(platform, /funnels/i);
  assert.match(platform, /zones/i);
  assert.match(platform, /UI.*MCP/is);
  assert.match(platform, /object IDs/i);

  assert.match(workspace, /tracking-plan\.md/i);
  assert.match(workspace, /release-register\.md/i);
  assert.match(workspace, /saved-objects\.md/i);
  assert.match(workspace, /working-notes\.md/i);

  assert.match(output, /Question answered/i);
  assert.match(output, /Data used/i);
  assert.match(output, /Confidence and caveats/i);
  assert.match(output, /Repeatability/i);

  assert.match(plan, /decision/i);
  assert.match(plan, /surface/i);
  assert.match(funnel, /optional.*mandatory/is);
  assert.match(zones, /exposure rate/i);
  assert.match(errors, /recoveries/i);
  assert.match(errors, /observable abandoners/i);
  assert.match(launch, /release register/i);
  assert.match(summary, /stakeholder/i);
});
```

- [ ] **Step 2: Add failing router/capability-map assertions**

Extend the existing router and capability-map tests:

```js
assert.match(skill, /contentsquare-analysis/i);
assert.match(capabilityMap, /Contentsquare analysis.*Implemented/is);
assert.match(pitfalls, /Platform agnosticism/i);
assert.match(pitfalls, /Analytics overreach/i);
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
npm test
```

Expected: FAIL because `skills/contentsquare-analysis/` does not exist and router files do not mention the new route.

---

## Chunk 2: Create The Skill Core

### Task 2: Create `SKILL.md`

**Files:**

- Create: `skills/contentsquare-analysis/SKILL.md`

- [ ] **Step 1: Write the skill router and guard**

Use this structure:

```markdown
---
name: contentsquare-analysis
description: Use when the user asks for Contentsquare analysis, CS funnel/page/journey/error/zone/dashboard interpretation, CS evidence validation, CS MCP analysis, or Contentsquare-based stakeholder reporting.
---

# contentsquare-analysis

This skill governs Contentsquare-only analysis. It helps Claude clarify the business question, load project-local context, check Contentsquare MCP capability, validate CS evidence, and produce standardised outputs without treating first-pass numbers or AI-generated CS findings as proof.

The skill is not platform-agnostic in v1. It may be extended through future platform profiles, but this implementation only supports Contentsquare.

## Non-negotiables

1. Start from the business question and desired output, not the dashboard.
2. Load project-local context before analysis when available.
3. Check Contentsquare MCP availability, authentication, target project, and capability limits before relying on live data.
4. Use object IDs rather than names when duplicate mappings, page groups, goals, or segments may exist.
5. Validate date range, comparison period, device, segment logic, denominators, and known artefacts before interpretation.
6. Do not blend device or segment groups when the behaviour differs materially.
7. Separate observation, interpretation, recommendation, next check, and caveat.
8. Name blind spots that Contentsquare cannot answer. Do not route to GA, BI, payment, identity, or experimentation data inside this skill.
9. Treat UI-only tasks as UI handoffs rather than pretending the MCP can do them.
10. Never embed client-specific IDs, credentials, raw commercial figures, or private working notes in the skill.

## Pre-flight checklist

1. Identify the job: planning, live analysis, validation, interpretation, or report output.
2. If the ask is vague, read `playbooks/question-to-analysis-plan.md`.
3. Read `references/project-workspace-contract.md` and load available project-local context.
4. Read `references/contentsquare-platform.md` before querying or interpreting CS data.
5. Pick the relevant playbook.
6. Confirm output shape and confidence when stakes or scope are unclear.

## Mode router

- Vague CS question or new analysis brief -> `playbooks/question-to-analysis-plan.md`.
- Funnel, journey, conversion, step drop, or path leak -> `playbooks/funnel-and-journey-analysis.md`.
- Page, mapping, device, audience, or segment comparison -> `playbooks/page-and-segment-analysis.md`.
- Zone or component interaction analysis -> `playbooks/zone-analysis.md`.
- Error analytics or missed-opportunity claims -> `playbooks/error-impact-analysis.md`.
- Launch, release, UX change, or before/after impact -> `playbooks/launch-impact-analysis.md`.
- Stakeholder summary, analyst note, or report packaging -> `playbooks/stakeholder-summary.md` and `references/output-style.md`.

## Default output shape

1. Question answered.
2. Data used: project, date range, comparison, device, segment, CS objects, MCP/UI caveats.
3. Headline read.
4. Findings with observation, interpretation, recommendation, and next check.
5. Confidence and caveats.
6. Repeatability notes.

## Verification

Before presenting conclusions, check that the evidence supports the answer, validation caveats are visible, and any MCP or UI limits are named.
```

- [ ] **Step 2: Run the targeted test**

Run:

```bash
npm test
```

Expected: still FAIL because references and playbooks are missing.

---

## Chunk 3: Add References

### Task 3: Create Contentsquare platform reference

**Files:**

- Create: `skills/contentsquare-analysis/references/contentsquare-platform.md`

- [ ] **Step 1: Add concise platform reference**

Include sections:

- `## Contentsquare Entities`
- `## MCP Capability Check`
- `## UI-Only Or Often UI-Led Checks`
- `## Validation Pitfalls`
- `## Blind Spots`

Must cover mappings, page groups, segments, funnels, goals, errors, journeys, zones, dashboards, saved objects, object IDs, duplicate-name traps, optional funnel steps, segment population checks, zoning exposure rate, and MCP/UI limits.

### Task 4: Create project workspace contract

**Files:**

- Create: `skills/contentsquare-analysis/references/project-workspace-contract.md`

- [ ] **Step 1: Add external artefact contract**

Include:

- `tracking-plan.md`
- `release-register.md`
- `saved-objects.md`
- `working-notes.md`
- `reports/`
- optional `data/raw/`, `data/processed/`, and `screenshots/`

State that missing files should trigger a minimum context checklist, not a hard stop.

### Task 5: Create output style reference

**Files:**

- Create: `skills/contentsquare-analysis/references/output-style.md`

- [ ] **Step 1: Add output style rules**

Include the default structure:

```markdown
## Finding Format

- Observation:
- Interpretation:
- Recommendation:
- Next check:
- Caveat:
```

Also include:

- stakeholder summary rules;
- analyst note rules;
- repeatability notes;
- confidence and caveat language;
- no hype, no urgency framing, no hidden method.

- [ ] **Step 2: Run tests**

Run:

```bash
npm test
```

Expected: still FAIL because playbooks and router updates are missing.

---

## Chunk 4: Add Playbooks

### Task 6: Create analysis playbooks

**Files:**

- Create: `skills/contentsquare-analysis/playbooks/question-to-analysis-plan.md`
- Create: `skills/contentsquare-analysis/playbooks/funnel-and-journey-analysis.md`
- Create: `skills/contentsquare-analysis/playbooks/page-and-segment-analysis.md`
- Create: `skills/contentsquare-analysis/playbooks/zone-analysis.md`
- Create: `skills/contentsquare-analysis/playbooks/error-impact-analysis.md`
- Create: `skills/contentsquare-analysis/playbooks/launch-impact-analysis.md`
- Create: `skills/contentsquare-analysis/playbooks/stakeholder-summary.md`

- [ ] **Step 1: Write `question-to-analysis-plan.md`**

Cover: decision, surface, audience/segment, date range, comparison, desired output, CS objects needed, project context to load, MCP capability check, and validation plan.

- [ ] **Step 2: Write `funnel-and-journey-analysis.md`**

Cover: page-group/object ID validation, optional-vs-mandatory steps, device split, segment denominator checks, confirmation/reconciliation checks, and ranking by behavioural impact.

- [ ] **Step 3: Write `page-and-segment-analysis.md`**

Cover: page/mapping scope, segment population, duplicate object names, device splits, comparison windows, and how to avoid overclaiming from aggregate movement.

- [ ] **Step 4: Write `zone-analysis.md`**

Cover: zoning availability, UI handoff, exposure-rate validity, coordinate-region traps, state-dependent controls, and component instrumentation limits.

- [ ] **Step 5: Write `error-impact-analysis.md`**

Cover: failure mode, trigger type, sessions affected vs recoveries, observable abandoners, modelled missed opportunity, and when to route non-CS evidence outside the skill as a blind spot.

- [ ] **Step 6: Write `launch-impact-analysis.md`**

Cover: release register first, like-for-like windows, launch-day exclusion or stabilisation gap, surface scoping, device separation, and correlation caveats.

- [ ] **Step 7: Write `stakeholder-summary.md`**

Cover: question answered, data used, headline read, findings format, caveats, next checks, and repeatability notes.

- [ ] **Step 8: Run tests**

Run:

```bash
npm test
```

Expected: still FAIL only on router, README, roadmap, manifest, or version assertions.

---

## Chunk 5: Wire Into The Suite

### Task 7: Update suite router and routing references

**Files:**

- Modify: `skills/product-suite-router/SKILL.md`
- Modify: `skills/product-suite-router/references/capability-map.md`
- Modify: `skills/product-suite-router/references/routing-pitfalls.md`

- [ ] **Step 1: Update router frontmatter and non-negotiables**

Add Contentsquare to the description and a non-negotiable:

```markdown
If Contentsquare analysis, CS evidence validation, or CS-based reporting is the user goal, route to `contentsquare-analysis`.
```

- [ ] **Step 2: Update toolbox routing matrix**

Add:

```markdown
- Contentsquare analysis, CS funnel/page/journey/error/zone interpretation, CS evidence validation, or CS-based stakeholder reporting -> `skills/contentsquare-analysis/SKILL.md`.
```

- [ ] **Step 3: Update capability map**

Add to Evidence and discovery or Testing and iteration:

```markdown
| Evidence and discovery | Contentsquare analysis | Implemented | `skills/contentsquare-analysis/SKILL.md` |
```

Also add a routing default for Contentsquare requests.

- [ ] **Step 4: Add routing pitfalls**

Add two sections:

- `Platform agnosticism`: symptom is generic analytics advice replacing CS-specific validation.
- `Analytics overreach`: symptom is pretending Contentsquare can answer GA/BI/payment/identity questions.

### Task 8: Update README and roadmap

**Files:**

- Modify: `README.md`
- Modify: `docs/roadmap.md`

- [ ] **Step 1: Add installed skill to README**

Add a bullet for `contentsquare-analysis` and include the folder in the layout.

- [ ] **Step 2: Update roadmap**

Add an implemented item under Evidence and discovery:

```markdown
- [x] Provide Contentsquare-only analysis support through `skills/contentsquare-analysis/`, covering question framing, MCP capability checks, measurement validation, CS playbooks, and standardised outputs.
```

### Task 9: Update plugin metadata and version

**Files:**

- Modify: `.claude-plugin/plugin.json`
- Modify: `package.json`

- [ ] **Step 1: Bump minor version**

Current version is `0.5.5`. Bump to `0.6.0` in both files unless a newer version exists when implementing.

- [ ] **Step 2: Update plugin description**

Add Contentsquare analysis to the plugin description without making it too long.

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 4: Run helper syntax check**

Run:

```bash
npm run check
```

Expected: PASS.

---

## Chunk 6: Final Verification

### Task 10: Check content quality and git diff

**Files:**

- Inspect all modified files.

- [ ] **Step 1: Search for forbidden client-specific leakage**

Run:

```bash
rg -n "known-client-name|known-project-id|known-mapping-id|known-page-group-id|commercial|revenue|AOV" skills/contentsquare-analysis README.md docs/roadmap.md tests/skill-content-contracts.test.js
```

Expected: no client-specific names, operational IDs, or commercial figures. Generic words like `revenue` should only appear as caveats or blind spots if used.

- [ ] **Step 2: Check router boundaries**

Run:

```bash
rg -n "contentsquare-analysis|research|design-critique|figma-writing|usertesting|brainstorming" skills/product-suite-router
```

Expected: Contentsquare route exists and existing specialist routes remain.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm test
npm run check
```

Expected: both PASS.

- [ ] **Step 4: Inspect final diff**

Run:

```bash
git diff --stat
git diff
```

Expected: only skill, router, docs, tests, and version metadata changes.

- [ ] **Step 5: Commit only if requested**

If the user asks for a commit:

```bash
git add skills/contentsquare-analysis skills/product-suite-router README.md docs/roadmap.md tests/skill-content-contracts.test.js .claude-plugin/plugin.json package.json
git commit -m "feat: add Contentsquare analysis skill"
```

Do not push unless explicitly requested.

## Handoff Notes

- This plan intentionally keeps v1 Contentsquare-only.
- Future platform agnosticism should be handled by adding a new platform profile after at least one more real platform has examples.
- The implementation should not add local scripts or helper code unless a repeated deterministic operation appears during real use.
- If the Contentsquare MCP is unavailable in the implementing session, still write the skill to include capability checks and UI handoff guidance; do not try to validate live CS calls as part of the content-contract tests.
