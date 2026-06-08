# UserTesting.com Workflow Skill Design

## Purpose

Add a dedicated `usertesting` skill for planning and synthesizing UserTesting.com studies. The skill should help product teams create concise, low-bias tests that match the platform's real building blocks, then turn exported results into compact evidence-led synthesis.

The skill is not a UserTesting.com automation layer. It guides the LLM to gather enough context, draft the study, explain what to export, and synthesize supplied outputs.

## Jobs To Be Done

1. Plan a UserTesting.com study.
2. Review or improve a draft UserTesting.com study for bias, length, audience fit, or platform fit.
3. Guide the user through exporting/sharing UserTesting.com results.
4. Synthesize exported UserTesting.com results into concise findings and useful visuals.

## Brief Requirements

Before drafting a study, the LLM must understand:

- Decision to inform: what product/design/business choice this test should help make.
- Primary research goal: one clear goal, written plainly.
- Audience: target user group, relevant behavior or experience, device/platform constraints, exclusions, and any comparison segments.
- Screener needs: what must be true for participants to qualify, and what should intentionally exclude them.
- Experience or artefact: live site, prototype, concept, copy, flow, or competitive experience being tested.
- Study type: unmoderated by default unless the user says otherwise.
- Success criteria: task success, comprehension, confidence, preference, friction, or other outcomes to observe.
- Constraints: time limit, number of participants, geography/language, device, data sensitivity, and what not to test.
- Desired output: launch-ready script, critique of script, export checklist, synthesis report, or stakeholder summary.

Audience is required because it controls the screener, task realism, wording, confidence, and interpretation. The skill should prefer behavior-based audience definitions over demographics alone.

## Planning Behavior

The skill should script against actual UserTesting.com study primitives:

- audience filters and custom screeners;
- starting URL or scenario;
- tasks and task groups;
- verbal responses;
- multiple choice and rating-scale questions;
- written responses when needed;
- success, difficulty, and other task metrics;
- Five Second Tests and comparison tasks when appropriate.

Default study shape:

1. Audience and screeners.
2. Starting scenario.
3. Short warm-up/context question.
4. Two to four focused tasks.
5. Verbal follow-up after each meaningful task.
6. Optional success/difficulty/rating metric where the metric will be used.
7. Short wrap-up.

Default length target: 15-20 minutes for unmoderated tests. The skill should recommend piloting with one participant per audience before launch when practical.

## Response Mode Rule

Prefer verbal responses for qualitative insight. Verbal responses preserve reasoning, hesitation, emotion, and context, and they fit UserTesting.com's think-aloud use case.

Use written responses sparingly for short structured answers, labels, rankings, or when the output needs easy copy/paste. Avoid long written responses, especially on mobile.

## Bias And Quality Guardrails

The skill should actively reduce bias by checking for:

- leading adjectives such as improved, better, easy, frustrating, obvious, or clear;
- yes/no questions without a useful follow-up;
- tasks that reveal the path or UI label when testing findability;
- instructions that test obedience rather than product usability;
- bundled tasks that ask participants to do multiple unrelated things;
- screeners that reveal the desired answer;
- over-recruiting based on demographics when behavior matters more;
- comparison tasks with unbalanced naming or ordering;
- synthesis claims that imply statistical confidence from small qualitative samples.

The correct pattern is to give participants realistic goals, not step-by-step instructions.

## Export And Handoff Guidance

For synthesis, the skill should ask for the UserTesting Excel export first when available because it can contain transcripts, demographics, written responses, multi-select responses, notes/clips, and metrics.

The skill should also accept:

- transcript exports;
- copied transcripts;
- notes or clips summaries;
- metrics screenshots or tables;
- session-by-session notes;
- manually pasted participant observations.

The skill should ask the user to include enough metadata for interpretation: participant IDs, audience segment, task labels, success/difficulty metrics if available, and any screening criteria.

## Synthesis Behavior

Synthesis should be concise by default. It should separate observed evidence from analyst inference and avoid overclaiming from small qualitative samples.

Default synthesis output:

1. Study goal and data received.
2. Top findings, usually three to five.
3. Evidence table with participant/task references.
4. Recommended changes in priority order.
5. Confidence and caveats.
6. Visual summary where useful.
7. Suggested next test or follow-up.

Visuals should be lightweight and text-native unless the user requests another format:

- participant x task success matrix;
- severity x frequency table;
- theme map;
- quote board grouped by theme;
- rating summary;
- before/after recommendation table.

Visuals should not make small samples look statistically stronger than they are.

## Skill Files

- `skills/usertesting/SKILL.md`: router and guard for UserTesting.com workflows.
- `skills/usertesting/references/platform-capabilities.md`: platform building blocks and export realities.
- `skills/usertesting/references/bias-and-quality-guardrails.md`: low-bias writing and concise-test rules.
- `skills/usertesting/playbooks/plan-unmoderated-test.md`: plan/script workflow.
- `skills/usertesting/playbooks/synthesize-results.md`: export handoff and synthesis workflow.

Update existing suite files so the router treats UserTesting.com workflows as implemented:

- `skills/product-suite-router/SKILL.md`
- `skills/product-suite-router/references/capability-map.md`
- `README.md`
- `docs/roadmap.md`
- `tests/skill-content-contracts.test.js`
