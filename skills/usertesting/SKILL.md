---
name: usertesting
description: Use when planning, reviewing, or synthesizing UserTesting.com studies, including audience and screener definition, concise low-bias test scripts, platform-realistic task/question structure, export guidance, and qualitative results synthesis.
---

# usertesting

This skill governs UserTesting.com workflows for product teams. It helps the LLM turn a product or design question into a concise, low-bias UserTesting.com study and turn exported results into compact synthesis.

This skill does not automate UserTesting.com. It prepares briefs, scripts, export instructions, and synthesis from material the user supplies.

## Non-negotiables

1. Start with a clear brief before drafting a test. The brief must name the decision to inform, the primary research goal, the target audience, and the experience or artefact being tested.
2. Treat audience definition as required. Capture target users, relevant behavior or experience, device/platform constraints, exclusions, comparison segments, and screener needs.
3. Prefer behavior-based audience criteria over broad demographics unless demographics materially affect the product decision.
4. Script against real UserTesting.com building blocks: audience filters, screeners, scenarios, tasks, verbal responses, written responses, multiple choice, rating scales, success metrics, difficulty metrics, task groups, Five Second Tests, comparisons, transcripts, clips or notes, and Excel export.
5. Prefer verbal responses for qualitative insight. Use written responses sparingly for short structured answers, labels, rankings, or easy copy/paste.
6. Keep tests concise. Aim for 15-20 minutes for unmoderated studies, two to four focused tasks, and a short wrap-up unless the user explicitly needs a different shape.
7. Reduce bias actively: give participants realistic goals, not step-by-step instructions; avoid leading wording; avoid revealing UI labels when testing findability; balance comparison naming and order.
8. For synthesis, ask for the UserTesting.com Excel export first when available, then accept transcripts, clips or notes, metrics screenshots, pasted session notes, or participant summaries.
9. Separate observed evidence from analyst inference. Do not imply statistical confidence from small qualitative samples.
10. Keep synthesis concise and use lightweight visuals when the data supports them.

## Pre-flight checklist

Before doing UserTesting.com work:

1. Identify the job: plan a study, review a draft, guide export, or synthesize results.
2. If planning or reviewing a study, read `references/platform-capabilities.md` and `references/bias-and-quality-guardrails.md`.
3. If planning an unmoderated test, use `playbooks/plan-unmoderated-test.md`.
4. If synthesizing results, use `playbooks/synthesize-results.md`.
5. If the request lacks the decision, goal, audience, or artefact, ask one concise question before drafting.
6. If the user wants fresh best-practice research or competitor evidence, route that portion to `research` first.

## Mode router

- New UserTesting.com study, test plan, script, screener, or audience setup -> `playbooks/plan-unmoderated-test.md`.
- Review an existing UserTesting.com draft for bias, length, audience fit, screener fit, or platform fit -> `references/bias-and-quality-guardrails.md` plus `playbooks/plan-unmoderated-test.md` review checks.
- Export or handoff guidance -> `references/platform-capabilities.md`, then ask for the highest-value available artifacts.
- Synthesize UserTesting.com results -> `playbooks/synthesize-results.md`.
- Need current platform documentation beyond the baked-in reference -> use `research` with official UserTesting.com documentation first.

## Default planning output

1. Brief recap.
2. Audience and screener plan.
3. Study setup assumptions.
4. Scenario and task script.
5. Question and metric blocks.
6. Bias and length check.
7. Launch checklist.
8. Pilot recommendation.

## Default synthesis output

1. Study goal and data received.
2. Top findings, usually three to five.
3. Evidence table with participant and task references.
4. Recommended changes in priority order.
5. Confidence and caveats.
6. Visual summary where useful.
7. Suggested next test or follow-up.

## Verification

Before presenting a UserTesting.com plan or synthesis, check:

- The primary goal is clear enough to decide what not to test.
- The target audience and screeners match the goal.
- The script uses platform-realistic task and question blocks.
- Verbal responses are the default qualitative follow-up.
- The test is short enough for an unmoderated study or the exception is stated.
- Leading or path-revealing wording has been removed.
- Synthesis distinguishes evidence, inference, confidence, and caveats.
- Any visual summary is supported by the supplied data and does not overclaim.
