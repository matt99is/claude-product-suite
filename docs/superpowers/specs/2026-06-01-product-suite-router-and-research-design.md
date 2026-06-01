# Product Suite Router And Research Skill - Design Spec

**Date:** 2026-06-01
**Status:** Design approved for router-first architecture; implementation planning next

## Overview

`claude-product-suite` should become a single installable Claude Code plugin
for UX, product, design, and creative workflows. The plugin should grow by
adding focused skills over time, while keeping a clear routing layer that helps
Claude decide which skill to consult for a user's request.

The next phase parks deeper Figma work and introduces two pieces:

1. A top-level `product-suite-router` skill that classifies broad product,
   UX, design, and creative intents.
2. A first solid specialist skill, `research`, for source-led research and
   evidence synthesis.

The router does not perform specialist work itself. It selects or chains the
right skill when appropriate, and it avoids pretending that future skills
already exist.

## Audience

Primary audience:

- UX team members using Claude Code for research, synthesis, design planning,
  and product/design artefact creation.

Secondary future audience:

- Product owners who may benefit from decision-focused research, product brief
  processing, recommendations, and later deck/prototype workflows.

The plugin must be useful to other users who install it. Personal workflows can
be layered on later, but the core skills must not require private vault paths,
Telegram automation, NotebookLM accounts, or Matt-specific local setup.

## Goals

- Establish a durable routing architecture for a growing suite of skills.
- Make `research` the first production-quality specialist skill after
  `figma-writing`.
- Ensure research starts from a useful brief so source collection is targeted.
- Produce source-backed synthesis with clear separation between evidence and
  interpretation.
- Include a clean URL list that users can optionally paste into NotebookLM.
- Make future skills easy to onboard and improve over time.
- Keep the plugin portable for colleagues and future external users.

## Non-goals

- Do not deepen the Figma skill in this phase.
- Do not make research a mandatory pre-step for decks, prototypes, wireframes,
  or Figma work.
- Do not require NotebookLM, the vault, or any private automation for the
  research skill to work.
- Do not scaffold many thin placeholder skills. Missing skills should be named
  honestly as future capabilities.
- Do not automate source ingestion into NotebookLM in this phase.

## Architecture Decision

Use a top-level router skill plus focused specialist skills.

Chosen shape:

```text
skills/
  product-suite-router/
    SKILL.md
    references/
      capability-map.md
      routing-pitfalls.md
  research/
    SKILL.md
    references/
      source-quality.md
      research-pitfalls.md
    playbooks/
      brief-to-research-plan.md
      source-led-research.md
      evidence-synthesis.md
      competitor-scan.md
commands/
  research-learn.md
```

The existing `figma-writing` skill remains in place, but deeper Figma
improvement is deferred.

## Router Skill Design

`product-suite-router` is the suite's front door. It should activate for broad
UX, product, design, and creative workflow requests where the right specialist
skill may be unclear.

It should answer four questions:

1. What is the user's primary intent?
2. Is there an implemented specialist skill for that intent?
3. Does the request need one skill or a sequence?
4. Is a clarifying question needed before choosing?

The router should be short and operational. It should route, not teach the
whole domain.

### Router Responsibilities

- Classify user requests into capability areas.
- Route implemented capabilities to the correct skill.
- Name future capabilities honestly when no specialist skill exists yet.
- Ask a short clarifying question when intent is ambiguous.
- Avoid unnecessary skill chaining.
- Preserve the user's requested output as the main objective.

### Capability Map

Initial capabilities:

| Capability | Status | Route |
|---|---|---|
| Research | Implement next | `skills/research/SKILL.md` |
| Evidence synthesis | Implement next | `skills/research/SKILL.md` |
| Figma writing | Existing partial v1 | `skills/figma-writing/SKILL.md` |
| Figma design-system-safe creation | Future improvement | No specialist beyond current Figma writing guard |
| Wireframing | Future | General reasoning until a skill exists |
| Prototyping | Future | General reasoning until a skill exists |
| Slide decks | Future | General reasoning until a skill exists |
| Product brief processing | Future or later research-adjacent skill | General reasoning or research when evidence is requested |

### Routing Rules

- If the user asks to research a subject, route to `research`.
- If the user asks for a competitor scan, evidence base, best-practice review,
  trend scan, market scan, or source-backed UX/product recommendation, route to
  `research`.
- If the user provides sources and asks for synthesis, route to `research` but
  skip source discovery.
- If the user asks for a deck, prototype, wireframe, or Figma output, route to
  that specialist skill when it exists. Do not automatically route through
  research.
- If a deck, prototype, or design request clearly depends on unknown external
  facts, ask whether the user wants research first.
- If no relevant specialist exists, proceed with general assistance and note
  that the suite does not yet have a dedicated skill for that capability.

### Router Pitfalls

- Over-routing: turning every downstream task into a research task.
- Under-routing: answering research questions from memory instead of invoking
  the research workflow.
- False capability: acting as though future skills already exist.
- Chain inflation: invoking several skills when one direct workflow would do.
- Ambiguity drift: failing to ask whether the user wants evidence gathering,
  synthesis of supplied material, or production of an artefact.

## Research Skill Design

`research` is a general evidence skill for UX and product work. It should make
Claude deliberate about what it is looking for, why the research matters, and
how source quality affects confidence.

It is not a NotebookLM skill. It should produce an optional NotebookLM-ready URL
list, but it must work without NotebookLM.

### Research Responsibilities

- Build or confirm a research brief before source collection starts.
- Identify what decision, artefact, or product question the research must
  inform.
- Collect and read credible sources.
- Classify serious candidate sources by trust and allowed use.
- Synthesis only from sources read in the current pass or supplied by the user.
- Separate source-backed findings from analyst inference.
- Produce actionable UX/product implications.
- Include a clean list of URLs for optional NotebookLM use.

### Research Non-goals

- Do not cover deep user-interview coding in v1.
- Do not perform survey-statistics workflows in v1.
- Do not create slide decks, prototypes, or visual artefacts.
- Do not require a persistent local research bundle.
- Do not require automated browser or NotebookLM ingestion.

### Brief-first Workflow

If the user request is not specific enough, the research skill should ask
enough questions to produce a useful brief before looking for sources.

Minimum brief fields:

- The ask
- Why this matters
- What the research must inform
- Audience or stakeholder context
- Constraints
- Expected output

For a UX team, the brief should make the decision context explicit. For product
owners, it should also clarify desired business outcome, risk, and actionability.

### Source Quality Model

Research should classify serious candidate sources as:

- `Strong`: official, primary, original research, established research
  organization, notable publication, or direct product/account evidence.
- `Medium`: credible secondary reporting, auditable consultancy/vendor
  analysis, or useful but self-interested company case material.
- `Weak`: thin SEO content, unaudited opinion, stat roundups with unclear
  sourcing, low-authority commentary, affiliate/promotional content.

Weak sources may support context or examples. They must not carry key claims.

### Output Shape

Default research output:

1. Brief recap
2. Executive summary
3. Key findings
4. Evidence table or source notes
5. UX/product implications
6. Risks, caveats, and confidence
7. Recommended next actions
8. Clean URL list

The clean URL list must be one URL per line with no markdown, titles, labels, or
blank lines between entries, so the user can paste it into NotebookLM if wanted.

### Research Playbooks

Initial playbooks:

- `brief-to-research-plan.md`: turn a vague ask into a research plan.
- `source-led-research.md`: collect, evaluate, and synthesise new sources.
- `evidence-synthesis.md`: synthesise from supplied source material without
  doing source discovery.
- `competitor-scan.md`: compare competitors or examples against a UX/product
  question.

## Learning Loop

The first learning loop for this phase should be `commands/research-learn.md`.

It should capture:

- New source-quality pitfalls.
- Repeated synthesis mistakes.
- Missing research playbook steps.
- Useful research output formats.
- Domain-specific source patterns for UX/product research.

The command should draft a structured entry, show it to the user for approval,
then update the relevant research reference or playbook. Code/helper changes are
out of scope unless a future helper surface exists.

## Skill Onboarding Pattern

Every future skill should follow the same basic contract:

```text
skills/<skill-name>/
  SKILL.md                  # router and guard for this capability
  references/               # pitfalls, quality bars, examples, constraints
  playbooks/                # repeatable workflows
  helpers/                  # optional, only when execution code is needed
commands/
  <skill-name>-learn.md     # optional learning loop
```

The top-level router's capability map is updated when a specialist skill becomes
real. It should not advertise a skill as implemented before that skill has a
usable `SKILL.md` and at least one playbook or reference that changes Claude's
behavior.

## Portability

The plugin should distinguish core behavior from personal/local integrations.

Core behavior:

- Skill routing
- Brief-first research
- Source quality guidance
- Synthesis structure
- Clean URL list
- Learning loop pattern

Optional local enhancements:

- Vault research bundles
- NotebookLM import workflow
- Telegram-routed automation
- Project-specific templates

The public skill should not break when optional local enhancements are absent.

## Validation

Router validation:

- Given sample user requests, confirm the router selects the expected
  specialist or asks a clarifying question.
- Confirm it does not route prototype, deck, or Figma requests through research
  by default.
- Confirm it honestly handles missing future skills.

Research validation:

- Confirm vague research asks trigger brief-building before source collection.
- Confirm supplied-source synthesis skips source discovery.
- Confirm outputs include source-backed findings, separated inference, caveats,
  and a clean URL list.
- Confirm weak sources are not used as key evidence.
- Confirm no NotebookLM dependency is required.

Repo validation:

- `npm test`
- `npm run check`

## Open Questions For Later

- Should `product-suite-router` be exposed as a user-facing skill only, or also
  mirrored in `AGENTS.md` for local development sessions?
- Should research outputs be file-based by default, or only written to files on
  request?
- Should a future `brief-processing` skill be separate from `research`, or
  should research own product brief clarification until the need is clearer?
- What exact samples should be used as the routing test suite?
- How should colleague-specific preferences be configured without hard-coding
  them into the shared plugin?

## Success Criteria

- A user can ask for research and Claude reliably starts with a brief.
- A user can ask for a prototype or deck and Claude does not force a research
  detour.
- The research output is useful to a UX practitioner and legible to a product
  owner.
- The output includes a paste-ready URL list for optional NotebookLM use.
- New skills can be added without rethinking the whole suite.
- The plugin remains installable and useful for other users.
