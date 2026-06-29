# Writing Style Skill Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a writing-style skill that drafts and edits prose while scrubbing common AI tropes.

**Architecture:** Follow the existing plugin pattern: `SKILL.md` as router and guard, `references/` for quality bars and watchlists, and `playbooks/` for repeatable operations. Wire the skill through the product-suite router, README, roadmap, tests, and release metadata.

**Tech Stack:** Markdown skills and references, Node `node:test` content-contract tests, plugin JSON metadata.

---

## Chunk 1: Content Contract

### Task 1: Add Failing Contract Tests

**Files:**
- Modify: `tests/skill-content-contracts.test.js`

- [x] **Step 1: Write failing tests**

Add tests for `skills/writing-style/SKILL.md`, its references and playbooks, and router/docs integration.

- [x] **Step 2: Run tests to verify failure**

Run: `npm test`

Expected: FAIL because `skills/writing-style/SKILL.md` and router references do not exist yet.

## Chunk 2: Skill Implementation

### Task 2: Add Skill Files

**Files:**
- Create: `skills/writing-style/SKILL.md`
- Create: `skills/writing-style/references/plain-writing-quality-bar.md`
- Create: `skills/writing-style/references/ai-trope-watchlist.md`
- Create: `skills/writing-style/playbooks/scrub-ai-tropes.md`
- Create: `skills/writing-style/playbooks/draft-clear-copy.md`

- [x] **Step 1: Create the skill and resources**

Include explicit guardrails for em dash dependence, `not just X, but Y`, rule of three cadence, and detector caution.

### Task 3: Wire Router and Docs

**Files:**
- Modify: `skills/product-suite-router/SKILL.md`
- Modify: `skills/product-suite-router/references/capability-map.md`
- Modify: `README.md`
- Modify: `docs/roadmap.md`
- Modify: `CHANGELOG.md`
- Modify: `package.json`
- Modify: `.claude-plugin/plugin.json`

- [x] **Step 1: Add routing and documentation**

Make `writing-style` an implemented communication skill and bump the version to `0.7.0`.

## Chunk 3: Verification

### Task 4: Verify

**Files:**
- Test: `tests/skill-content-contracts.test.js`

- [x] **Step 1: Run tests**

Run: `npm test`

Expected: PASS.

- [x] **Step 2: Run syntax check**

Run: `npm run check`

Expected: PASS.
