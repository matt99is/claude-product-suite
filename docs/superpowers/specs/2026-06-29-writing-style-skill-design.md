# Writing Style Skill Design

## Goal

Add an all-purpose writing style skill to `claude-product-suite` that helps
draft and edit prose while avoiding common AI writing tropes.

## Scope

- Create `skills/writing-style/` with a lean `SKILL.md`, references, and
  playbooks.
- Route writing, editing, rewrite, tone, voice, copy, prose, de-AI, and AI
  trope requests to the new skill.
- Include explicit guardrails for em dash dependence, `not just X, but Y`, and
  rule of three cadence.
- Treat trope lists as diagnostics, not banned-word rules.
- Update README, roadmap, capability map, changelog, manifest, and package
  version.

## Research Basis

The skill uses source-informed principles from GOV.UK, Google, Microsoft,
Nielsen Norman Group, Orwell's plain-writing essay, and recent AI-text detection
research. The operational takeaway is that good writing scrub work should
improve clarity, specificity, structure, and reader usefulness instead of chasing
AI detector scores.

## Design

`SKILL.md` acts as the router and safety guard. It keeps the skill general and
small, while references hold the quality bar and trope watchlist. Two playbooks
cover the main workflows: editing existing prose and drafting new prose.

The skill should avoid forcing a heavy process. For quick rewrites, it can
return only revised copy. For coaching or review, it can show before and after
changes with short rationale.

## Success Criteria

- Content-contract tests prove the skill exists, names the specific trope
  patterns, and appears in router/docs.
- Existing tests pass.
- Version and changelog are updated for a new minor release.
