---
name: brainstorming
description: Use when the user asks to brainstorm, generate, shape, compare, narrow, or translate product, design, UX, positioning, feature, copy, experiment, or creative concept ideas without requiring source-backed research, artefact critique, UserTesting.com study operations, or Figma mutation.
---

# brainstorming

This skill helps product teams move from fuzzy thoughts to useful options,
sharper concepts, and practical next steps. It owns possibility generation and
concept shaping. It does not own evidence gathering, critique of artefacts,
UserTesting.com workflows, Figma mutation, or implementation planning.

## Non-negotiables

1. Preserve the user's desired output: ideas, options, concept, comparison,
   recommendation, or lightweight handoff.
2. Do not use brainstorming when another implemented specialist is the better
   match.
3. Do not turn creative possibilities into validated claims.
4. Separate creative ideas, product judgment, assumptions, and evidence-backed
   claims.
5. Generate genuinely different directions before narrowing when the user asks
   for exploration.
6. Avoid generic product cliches and idea soup.
7. End with a usable next step.
8. Suggest handoff to another skill only when it serves the requested output.

## Do not use brainstorming when

- The user asks for source-backed evidence, best practices, competitor examples,
  market scans, trend scans, or synthesis of supplied sources. Use `research`.
- The user asks to critique, review, audit, score, or find problems in a static
  artefact. Use `design-critique`.
- The user asks to plan, review, export, or synthesize a UserTesting.com study.
  Use `usertesting`.
- The user asks to mutate, clone, generate, or update nodes in Figma. Use
  `figma-writing`.
- The user asks for implementation planning or code changes. Use the normal
  development workflow, not this skill.

If the request could mean either ideation or evidence, critique, testing, or
mutation, ask one clarifying question before routing.

## Pre-flight checklist

Before brainstorming:

1. Identify the requested output and the decision it should help with.
2. Check whether `research`, `design-critique`, `usertesting`, or
   `figma-writing` is a better match.
3. Select the smallest useful mode.
4. If mode or output is ambiguous, ask one concise clarifying question.
5. Read the relevant playbook and the quality bar.

## Mode router

Choose the smallest mode that satisfies the user's requested output.

- `Diverge`: broad option generation for ideas, concepts, names, angles,
  directions, feature variants, copy territories, experiment ideas, or "what
  could we do?"
- `Shape`: turn a fuzzy or incomplete idea into a coherent concept. Default to
  this mode when the request is unclear.
- `Compare`: evaluate known options against criteria and tradeoffs.
- `Narrow`: recommend a direction, priority, MVP slice, or next move.
- `Translate`: turn a chosen idea into a lightweight brief, prompt, test idea,
  deck outline, Figma request, or other downstream handoff.

Mode switching is allowed when it is natural. A useful brainstorm may move from
`Shape` to `Diverge` to `Compare` to `Narrow`, but do not expose a heavy process
unless it helps the user.

## Playbook router

- Fuzzy idea, broad ideation, feature ideas, concept options, positioning
  angles, copy directions, or experiment ideas -> `playbooks/shape-and-generate.md`.
- Known options, prioritisation, MVP choice, recommendation, or next-move
  decision -> `playbooks/compare-and-narrow.md`.

For all brainstorming work, read `references/brainstorming-quality-bar.md`. If
the request is broad or at risk of drifting into another skill, read
`references/brainstorming-pitfalls.md`.

## Default output shape

1. Goal recap.
2. Assumptions and constraints.
3. Options, shaped concept, or comparison.
4. Themes, tradeoffs, or decision criteria.
5. Strongest directions.
6. Suggested next step.

For broad ideation, cluster ideas into themes rather than producing a long flat
list. For recommendations, include what would change the recommendation.

## Handoff rules

Offer a handoff only when the user wants the next artefact or the idea needs a
specialist workflow:

- Need external proof -> `research`.
- Need critique of an artefact -> `design-critique`.
- Need a UserTesting.com study plan, script review, export guidance, or results
  synthesis -> `usertesting`.
- Need Figma mutation or write-capable setup troubleshooting -> `figma-writing`.

## Verification

Before answering, check:

- The mode matches the user's requested output.
- The answer does not present brainstormed ideas as validated evidence.
- Assumptions are labelled.
- The output gives specific, audience-aware, actionable directions.
- Any suggested handoff is optional and justified by the user's goal.
