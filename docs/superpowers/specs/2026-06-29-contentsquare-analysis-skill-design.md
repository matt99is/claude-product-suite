# Contentsquare Analysis Skill Design

## Purpose

Add a dedicated `contentsquare-analysis` skill for rigorous, repeatable Contentsquare analysis and stakeholder-ready output. The skill should help product, UX, ecommerce, and analytics users get from a vague business question to a validated Contentsquare readout without treating dashboard screenshots, AI-generated findings, or first-pass funnel numbers as proof.

The skill is Contentsquare-only for v1. It should be architected around a platform profile so another analytics platform could be added later, but it must not dilute the v1 workflow into generic analytics advice.

## Jobs To Be Done

1. Clarify a user's business question until the decision, surface, audience, time window, and expected output are explicit enough to analyse.
2. Translate the question into a Contentsquare evidence plan: mappings, page groups, segments, funnels, journeys, zones, errors, goals, dashboards, or UI-only checks.
3. Load and use project-local context such as tracking plans, saved-object registers, release registers, known caveats, and prior reports.
4. Check Contentsquare MCP availability, authentication, project selection, and capability limits before relying on live data.
5. Validate data before interpretation: date range, device, segment, object IDs, denominators, mutually-exclusive segments, funnel reconciliation, and known artefacts.
6. Separate observation, interpretation, recommendation, next check, and caveat.
7. Produce standardised outputs: concise stakeholder summaries, analyst notes, report drafts, or reusable project notes.

## Scope

The skill owns Contentsquare-led analysis. In v1 it should not own GA4, BI, experimentation, payment-gateway, identity-provider, or wider research workflows. When those sources are needed, the skill should name the blind spot and route it to the project owner rather than pretending Contentsquare can answer it.

The skill should support several Contentsquare analysis modes:

- question framing and analysis planning;
- conversion or journey funnel diagnosis;
- page and journey performance analysis;
- segment, device, and audience comparison;
- zoning and component interaction analysis;
- error impact analysis;
- launch or UX-change impact analysis;
- dashboard or saved-object validation;
- stakeholder and analyst output generation.

Basket and checkout analysis should be a strong playbook example, not the boundary of the skill.

## Fit With The Suite

`claude-product-suite` is a modular toolbox. `contentsquare-analysis` should sit in the evidence and iteration area as a specialist analytics skill. It should not become the mandatory front door for product decisions, research, design critique, or testing.

Routing rules:

- Use `contentsquare-analysis` when the user asks for Contentsquare analysis, CS dashboard interpretation, CS funnel/page/journey/error/zone analysis, CS evidence validation, or CS-based stakeholder reporting.
- Use `research` when the user asks for source-led external evidence, competitor scans, or best-practice research.
- Use `design-critique` when the user asks for critique of a static artefact without analytics evidence.
- Use `usertesting` when the user asks for UserTesting.com planning or synthesis.
- Use `figma-writing` only when the output needs mutation in Figma.

## Recommended Architecture

Use a lean `SKILL.md` as a router and guard, with references and playbooks loaded only when needed.

Proposed files:

- `skills/contentsquare-analysis/SKILL.md`: trigger rules, non-negotiables, pre-flight workflow, mode router, default output shape.
- `skills/contentsquare-analysis/references/contentsquare-platform.md`: CS object model, MCP setup checks, UI-vs-MCP limits, common measurement artefacts, and validation checks.
- `skills/contentsquare-analysis/references/project-workspace-contract.md`: external files the project should provide and how to proceed when they are missing.
- `skills/contentsquare-analysis/references/output-style.md`: standardised report structure, tone, caveat handling, and finding format.
- `skills/contentsquare-analysis/playbooks/question-to-analysis-plan.md`
- `skills/contentsquare-analysis/playbooks/funnel-and-journey-analysis.md`
- `skills/contentsquare-analysis/playbooks/page-and-segment-analysis.md`
- `skills/contentsquare-analysis/playbooks/zone-analysis.md`
- `skills/contentsquare-analysis/playbooks/error-impact-analysis.md`
- `skills/contentsquare-analysis/playbooks/launch-impact-analysis.md`
- `skills/contentsquare-analysis/playbooks/stakeholder-summary.md`

The skill should not bundle client-specific IDs, commercial figures, account credentials, raw exports, or private working notes.

## Platform Profile Rule

The core workflow should be written in a way that could support future platform profiles, but only a Contentsquare profile should exist in v1.

The platform profile must answer:

- What entities exist in this platform?
- How are mappings, page groups, segments, funnels, goals, errors, journeys, zones, dashboards, and saved objects represented?
- Which entities can the MCP read or create?
- Which checks require the Contentsquare UI?
- What date, segment, device, and comparison constraints matter?
- What known artefacts can create false conclusions?
- What is the minimum evidence needed before making a recommendation?

This keeps the design extensible without making the first implementation platform-agnostic.

## Project Workspace Contract

The skill should expect project-local files outside the bundled skill. These files carry client, account, or workstream context that must not be hard-coded into the skill.

Recommended project artefacts:

- `tracking-plan.md`: tag coverage, event definitions, known gaps, domains, page mappings, and measurement ownership.
- `release-register.md`: launch dates, feature flags, rollout notes, surfaces touched, and known incidents.
- `saved-objects.md`: project IDs, mapping IDs, page-group IDs, segment IDs, funnel IDs, dashboards, and naming caveats.
- `working-notes.md`: operational detail, validated objects, current caveats, private numbers, and in-progress findings.
- `reports/`: published or draft outputs.
- `data/raw/` and `data/processed/`: approved exports only, if the project uses local files.
- `screenshots/`: approved UI captures where MCP access is insufficient.

If these files are absent, the skill should not block all analysis. It should create a minimum context checklist, ask for the missing essentials, and label any resulting output as provisional.

## MCP Requirements

Before live analysis, the skill should run a Contentsquare capability check:

1. Confirm a Contentsquare MCP is available in the session.
2. Confirm authentication or explain the required login path.
3. Confirm the target project/site/account and date range.
4. Identify what the MCP can access in the current session.
5. Identify what must be checked manually in the CS UI.
6. Record capability limits in the analysis notes or final caveats.

The skill should treat MCP access as an execution surface, not as a source of truth by itself. If the MCP cannot query zones, journeys, dashboards, saved objects, or screenshots, the skill should say so and provide a UI handoff checklist.

## Analysis Workflow

Default workflow:

1. **Clarify the ask.** Capture the decision, surface, audience or segment, date window, comparison period, desired output, and why the answer matters.
2. **Load project context.** Read the workspace contract files where present. Pay special attention to the tracking plan, release register, saved objects, and known caveats.
3. **Plan evidence.** Choose the smallest set of Contentsquare objects and checks that can answer the question.
4. **Check MCP capability.** Confirm which parts can be queried live and which need UI/manual support.
5. **Validate measurement.** Confirm object IDs, denominators, segment logic, date ranges, device splits, optional steps, and known artefacts before interpreting.
6. **Analyse.** Separate observation from interpretation. Rank issues by behavioural impact, not just percentage-point change.
7. **Output.** Use the requested format and carry caveats, next checks, and repeatability notes.
8. **Capture reusable lessons.** If a durable Contentsquare pattern emerges, suggest adding it to the relevant project learning note or future skill reference.

## Validation Principles

The skill should enforce these checks wherever relevant:

- Use object IDs rather than names when duplicate mappings, page groups, goals, or segments may exist.
- Never blend device types when the question or expected behaviour differs by device.
- Treat optional or conditional pages as branches, not mandatory funnel steps.
- Confirm segment populations before trusting empty or tiny results.
- Confirm mutually-exclusive segments sum to the expected parent population when using them as partitions.
- Reconcile funnel completions to the best available Contentsquare transaction or confirmation measure when the analysis depends on conversion.
- Treat favourable metrics that contradict the rest of the evidence as "Verify", not as headlines.
- For error impact, distinguish sessions affected, observable abandoners, recoveries, and modelled missed opportunity.
- For launch impact, read the release register first, use like-for-like windows, exclude launch-day instability where appropriate, and scope to the touched surface.
- For zoning, validate exposure rate and beware coordinate boxes that measure a region rather than an element.

## Output Style

Default output should be compact, structured, and caveated:

1. Question answered.
2. Data used: project, date range, comparison, device, segment, Contentsquare objects, and MCP/UI caveats.
3. Headline read.
4. Findings, each with observation, interpretation, recommendation, and next check.
5. Confidence and caveats.
6. Repeatability notes: saved objects, IDs, or query steps needed to rerun.

Stakeholder summaries should use plain language, no hype, no urgency theatre, and no hidden method. Analyst outputs can include more method detail, object IDs, and validation notes.

## Implementation Updates

Implementation should add the new skill files and update:

- `skills/product-suite-router/SKILL.md`
- `skills/product-suite-router/references/capability-map.md`
- `skills/product-suite-router/references/routing-pitfalls.md`
- `README.md`
- `docs/roadmap.md`
- `tests/skill-content-contracts.test.js`
- `.claude-plugin/plugin.json`
- `package.json`

Adding a new specialist skill should be a minor release unless a larger release is already planned.

## Success Criteria

- The suite can route Contentsquare analysis requests to `contentsquare-analysis`.
- The skill stays Contentsquare-only in v1 while preserving a clear future platform-profile architecture.
- The skill asks for or loads project-local context rather than embedding client-specific data.
- The skill checks MCP capability before relying on live CS data.
- The skill catches common CS artefacts before producing conclusions.
- Outputs consistently separate observation, interpretation, recommendation, next check, and caveat.
- Existing skill routes for research, critique, Figma, UserTesting.com, and brainstorming remain intact.
- Content-contract tests cover the new skill and router updates.
