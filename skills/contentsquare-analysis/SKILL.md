---
name: contentsquare-analysis
description: Use when the user asks for Contentsquare analysis, CS funnel/page/journey/error/zone/dashboard interpretation, CS evidence validation, CS MCP analysis, or Contentsquare-based stakeholder reporting.
---

# contentsquare-analysis

This skill governs Contentsquare-only analysis. It helps Claude clarify the
business question, load project-local context, check Contentsquare MCP capability,
validate CS evidence, and produce standardised outputs without
treating first-pass numbers or AI-generated CS findings as proof.

The skill is not platform agnostic in v1. It may be extended through future
platform profiles, but this implementation only supports Contentsquare.

## Non-negotiables

1. Start from the business question and desired output, not the dashboard.
2. Load project-local context before analysis when available.
3. Check Contentsquare MCP availability, authentication, target project, and capability limits before relying on live data.
4. Use object IDs rather than names when duplicate mappings, page groups, goals, or segments may exist.
5. Validate date range, comparison period, device, segment logic, denominators, and known artefacts before interpretation.
6. Do not blend device or segment groups when behaviour differs materially.
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

Before presenting conclusions, check that the evidence supports the answer,
validation caveats are visible, and any MCP or UI limits are named.
