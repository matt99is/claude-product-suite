# Brainstorming Skill Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `brainstorming` skill for product/design/creative ideation with strong routing boundaries and release it as `0.4.0`.

**Architecture:** The skill follows the existing suite pattern: `SKILL.md` as router and guard, `references/` for quality bar and pitfalls, and `playbooks/` for operation recipes. The top-level router remains responsible for selecting the smallest specialist and avoiding lifecycle forcing.

**Tech Stack:** Markdown plugin skills, Node.js built-in `node:test`, no runtime dependencies.

---

## Chunk 1: Contract And Skill Files

### Task 1: Add Failing Content Contract

**Files:**
- Modify: `tests/skill-content-contracts.test.js`

- [ ] Add a test named `brainstorming skill supports product design ideation without over-routing`.
- [ ] Assert `skills/brainstorming/SKILL.md` exists and includes frontmatter, modes, negative router, mode selection, evidence language, and handoff rules.
- [ ] Assert quality-bar, pitfalls, and playbook files include core terms.
- [ ] Run `node --test tests/skill-content-contracts.test.js`.
- [ ] Expected: fail with missing `skills/brainstorming/SKILL.md`.

### Task 2: Create Brainstorming Skill

**Files:**
- Create: `skills/brainstorming/SKILL.md`
- Create: `skills/brainstorming/references/brainstorming-quality-bar.md`
- Create: `skills/brainstorming/references/brainstorming-pitfalls.md`
- Create: `skills/brainstorming/playbooks/shape-and-generate.md`
- Create: `skills/brainstorming/playbooks/compare-and-narrow.md`

- [ ] Write `SKILL.md` with non-negotiables, negative router, mode router, output shape, handoff rules, and verification.
- [ ] Write quality-bar reference focused on specificity, audience awareness, useful variety, assumptions, and actionability.
- [ ] Write pitfalls reference covering idea soup, premature narrowing, evidence laundering, over-routing, generic cliches, and overbuilding.
- [ ] Write playbooks for shape/generate and compare/narrow workflows.
- [ ] Run `node --test tests/skill-content-contracts.test.js`.
- [ ] Expected: brainstorming test passes or reveals missing content terms.

## Chunk 2: Router, Docs, Release

### Task 3: Wire Router And Docs

**Files:**
- Modify: `skills/product-suite-router/SKILL.md`
- Modify: `skills/product-suite-router/references/capability-map.md`
- Modify: `skills/product-suite-router/references/routing-pitfalls.md`
- Modify: `README.md`
- Modify: `docs/roadmap.md`

- [ ] Update router non-negotiables and matrix to route brainstorming to `skills/brainstorming/SKILL.md`.
- [ ] Mark brainstorming implemented in the capability map.
- [ ] Add routing pitfall guidance so brainstorming does not swallow research, critique, UserTesting.com, or Figma work.
- [ ] Add `brainstorming` to README installed skills and layout.
- [ ] Mark roadmap brainstorming item complete.
- [ ] Update tests to assert router/readme behavior if needed.

### Task 4: Release As 0.4.0

**Files:**
- Modify: `package.json`
- Modify: `.claude-plugin/plugin.json`
- Modify: `CHANGELOG.md`

- [ ] Bump version from `0.3.0` to `0.4.0`.
- [ ] Add `0.4.0` changelog entry dated `2026-06-08`.
- [ ] Run `npm test`.
- [ ] Run `npm run check`.
- [ ] Commit changes.
- [ ] Tag `v0.4.0`.
