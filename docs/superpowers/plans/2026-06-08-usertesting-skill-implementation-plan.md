# UserTesting.com Workflow Skill Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated UserTesting.com workflow skill for concise low-bias study planning, audience/screener definition, export guidance, and results synthesis.

**Architecture:** Follow the existing self-contained skill pattern: one `SKILL.md`, references for durable rules, playbooks for operation recipes, router/docs updates, and content-contract tests. No runtime code or dependencies are required.

**Tech Stack:** Markdown skill files, Node.js built-in `node:test`, existing package scripts.

---

## File Structure

- Create: `skills/usertesting/SKILL.md` for the skill router and non-negotiables.
- Create: `skills/usertesting/references/platform-capabilities.md` for UserTesting.com building blocks and export guidance.
- Create: `skills/usertesting/references/bias-and-quality-guardrails.md` for low-bias concise-test rules.
- Create: `skills/usertesting/playbooks/plan-unmoderated-test.md` for planning/script generation.
- Create: `skills/usertesting/playbooks/synthesize-results.md` for export handoff and synthesis.
- Modify: `skills/product-suite-router/SKILL.md` to route UserTesting.com workflows to the new skill.
- Modify: `skills/product-suite-router/references/capability-map.md` to mark UserTesting.com workflows implemented.
- Modify: `README.md` to document the installed skill.
- Modify: `docs/roadmap.md` to mark UserTesting.com workflow support implemented.
- Modify: `tests/skill-content-contracts.test.js` to lock the new behavior.

## Task 1: Add Failing Content Contract

- [ ] Add a test named `usertesting skill supports low-bias platform-realistic studies` to `tests/skill-content-contracts.test.js`.
- [ ] Assert the new skill and playbooks mention UserTesting.com, audience, screeners, verbal responses, concise tests, low-bias wording, Excel export, transcripts, synthesis, visuals, and qualitative confidence caveats.
- [ ] Run `npm test` and verify it fails because the new files do not exist yet.

## Task 2: Create UserTesting Skill Files

- [ ] Create `skills/usertesting/SKILL.md` with frontmatter, routing scope, non-negotiables, pre-flight checklist, mode router, default output shapes, and verification checklist.
- [ ] Create `platform-capabilities.md` with platform primitives and export handoff rules.
- [ ] Create `bias-and-quality-guardrails.md` with concise-study, audience, screener, task, response-mode, comparison, and synthesis anti-bias rules.
- [ ] Create `plan-unmoderated-test.md` with brief intake, audience/screener design, script structure, platform-fit review, and launch checklist.
- [ ] Create `synthesize-results.md` with data request order, evidence handling, visual summary options, and compact synthesis format.

## Task 3: Update Router And Docs

- [ ] Update `product-suite-router/SKILL.md` so UserTesting.com workflows route to `skills/usertesting/SKILL.md`.
- [ ] Update `capability-map.md` from future to implemented for UserTesting.com workflows.
- [ ] Update `README.md` installed skills and layout.
- [ ] Update `docs/roadmap.md` to mark UserTesting.com workflow support as implemented.

## Task 4: Verify

- [ ] Run `npm test` and confirm all content contracts pass.
- [ ] Run `npm run check` to keep the helper syntax check green.
- [ ] Run `git diff --check` to catch whitespace issues.
- [ ] Review `git diff` for scope and wording.
