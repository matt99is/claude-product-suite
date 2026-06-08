---
name: product-suite-router
description: Use when a UX, product, design, critique, research, Figma, wireframing, prototyping, slide-deck, testing, strategy, or creative workflow request may need routing to a specialist skill. Classify the job-to-be-done before doing the work.
---

# product-suite-router

This skill is the routing layer for `claude-product-suite`. The suite is a
modular toolbox for product teams: independent specialist tools that can be used
alone or combined when the user asks for a connected workflow.

The router does not perform specialist work itself. It protects the user goal
from drift: identify the job-to-be-done, choose the smallest implemented route
that satisfies it, avoid unnecessary handoffs, and be honest when a capability
is future capability rather than implemented behavior.

## Non-negotiables

1. Preserve the user primary intent and requested output.
2. Do not force a lifecycle, phase model, or A/B/C process onto the request.
3. Treat skills as independent specialist tools, not mandatory sequential steps.
4. Do not automatically route deck, prototype, wireframe, testing, strategy, or Figma requests through research.
5. Do not claim a future capability is implemented.
6. If evidence gathering is the user goal, route to `research`.
7. If Figma mutation is the user goal, route to `figma-writing`.
8. If static artefact critique is the user goal, route to `design-critique`.
9. If UserTesting.com study planning, script review, export guidance, or results synthesis is the user goal, route to `usertesting`.
10. Ask one clarifying question when the request could mean research, synthesis, critique, testing, or artefact production.

## Pre-flight checklist

Before doing product-suite work:

1. Identify the job-to-be-done and desired output.
2. Check `references/capability-map.md`.
3. If one implemented specialist satisfies the request, read that skill before work begins.
4. If multiple specialists are relevant, use only the ones needed for the requested output.
5. If no specialist exists, proceed with general assistance and name the gap plainly.
6. If a future or adjacent capability might benefit from research first, ask the user rather than assuming.

## Toolbox routing matrix

- Research, evidence gathering, competitor scan, trend scan, best-practice review -> `skills/research/SKILL.md`.
- Synthesis of supplied source material -> `skills/research/SKILL.md`, skipping source discovery.
- Figma write-side mutation or troubleshooting write-capable Figma setup -> `skills/figma-writing/SKILL.md`.
- Static design artefact critique, UX critique, heuristic review, or visual accessibility review -> `skills/design-critique/SKILL.md`.
- UserTesting.com study planning, script review, audience and screener setup, export guidance, or results synthesis -> `skills/usertesting/SKILL.md`.
- Product/design brainstorming, product brief processing, wireframes, prototypes, and slide decks -> future specialist skills; use general assistance for now unless the user explicitly asks for an implemented specialist first.

## Composition rules

Use one route by default. Chain or combine skills only when:

- the user explicitly asks for a sequence, such as research then critique or test synthesis then deck;
- one specialist output is clearly required as input to another requested deliverable;
- the user asks for options and wants help choosing which tool to use.

When combining skills, name the sequence briefly and keep each step in service of
the user requested output. Do not add research, critique, or Figma work as a
ceremonial pre-step.

## Ambiguous requests

When a request could reasonably fit more than one route, ask one concise
question. Prefer questions that distinguish the user desired output:

- "Do you want new evidence gathered, or synthesis of material you already have?"
- "Do you want critique of this artefact, or edits to the artefact?"
- "Do you want research first, or should I go straight to the prototype/deck/wireframe?"
- "Is this a product/design brainstorming request, or do you want source-backed research?"
- "Should I help with the testing plan, or synthesize results you already have?"

## Verification

Before answering, check that the selected route still matches the user output
request. If the work has drifted into a different route, pause and realign with
the user.
