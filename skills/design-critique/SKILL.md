---
name: design-critique
description: Use when the user asks for UX critique, design review, heuristic review, accessibility review, or source-grounded critique of static design artefacts such as screenshots, Figma frames, mockups, wireframes, exported images, or supplied visual specifications.
---

# design-critique

This skill governs source-grounded UX critique of static design artefacts. It helps Claude inspect a supplied artefact, understand the context it is meant to serve, identify UX and visual-accessibility issues, and explain the likely consequence of each issue without pretending a static artefact proves real-world usability.

The skill is deliberately artefact-only for v1. It critiques screenshots, Figma frames, mockups, wireframes, exported images, and supplied visual specifications. It does not perform live product testing, DOM inspection, keyboard testing, screen-reader testing, analytics review, or full accessibility compliance audits.

## Non-negotiables

1. Start from context: identify the artefact type, intended audience, user goal, primary objective, platform, and design maturity before critique.
2. If context is missing and materially affects the critique, ask one concise question before producing severity-ranked findings.
3. Ground critique in the baked-in source canon at `references/principles-library.md` and name the principle behind each major criticism.
4. Treat accessibility as visual accessibility only: target size, target spacing, colour contrast, visible affordances/states, font size, and readable text spacing.
5. Do not claim full accessibility compliance from a static artefact.
6. Separate evidence-backed issues from analyst inference and subjective visual preference.
7. Assign severity and confidence to each issue.
8. Explain the user or business consequence of each significant issue.
9. Include what works and should be preserved, not only what is wrong.
10. Escalate to `research` only when the user asks for fresh evidence, competitor comparison, domain-specific best practice, or support beyond the baked-in canon.

## Pre-flight checklist

Before critique work:

1. Identify whether the input is a static design artefact. If the user wants live interaction testing or DOM/accessibility validation, explain that this skill is not enough and offer the closest next step.
2. Capture or infer the context: audience, primary objective, platform, viewport/frame size, design stage, and desired critique depth.
3. Read `references/principles-library.md`.
4. Use `playbooks/artefact-critique.md` unless the user explicitly asks for a narrower review.
5. If measurable dimensions are unavailable, label size/spacing findings as estimates and lower confidence.

## Severity scale

- Critical: likely blocks task completion, excludes users, causes serious user error, or creates a likely accessibility failure for a primary action or essential content.
- High: materially harms comprehension, trust, task success, conversion, or safe decision-making.
- Medium: creates friction, inconsistency, or avoidable cognitive effort, but users have a reasonable workaround.
- Low: polish, minor clarity issue, weak consistency issue, or risk that is unlikely to affect task success.
- Observation: notable but not clearly harmful, or a subjective preference that should not be framed as a defect.

## Confidence scale

- High: directly visible in the artefact and grounded in a measurable or well-established principle.
- Medium: visible pattern suggests a likely issue, but missing interaction, content, or implementation context limits certainty.
- Low: plausible concern that needs user research, analytics, implementation details, or interactive validation.

## Default output shape

1. Context assumptions
2. What works
3. Severity-ranked issues
4. Visual accessibility risks
5. Highest-impact fixes
6. Open questions and limits of confidence
7. Sources used

## Verification

Before answering, check:

- Every major issue has a principle, consequence, recommendation, severity, and confidence.
- Visual-accessibility comments do not overclaim beyond the artefact.
- Subjective taste is labelled as preference or observation.
- Additional research is suggested only when it would materially improve the critique.
