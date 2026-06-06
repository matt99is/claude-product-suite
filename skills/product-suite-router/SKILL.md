---
name: product-suite-router
description: Use when a UX, product, design, critique, research, Figma, wireframing, prototyping, slide-deck, or creative workflow request may need routing to a specialist skill. Classify primary intent before doing the work.
---

# product-suite-router

This skill is the routing layer for `claude-product-suite`. It classifies the
user's primary intent and routes to an implemented specialist skill when one
exists.

It does not perform specialist work itself. The router protects the user's goal
from drift: choose the right path, avoid unnecessary handoffs, and be honest
when a capability is future capability rather than implemented behavior.

## Non-negotiables

1. Preserve the user's primary intent.
2. Do not automatically route deck, prototype, wireframe, or Figma requests through research.
3. Do not claim a future capability is implemented.
4. If evidence gathering is the user's goal, route to `research`.
5. If Figma mutation is the user's goal, route to `figma-writing`.
6. If static artefact critique is the user's goal, route to `design-critique`.
7. Ask one clarifying question when the request could mean research, synthesis, or artefact production.

## Pre-flight checklist

Before doing product-suite work:

1. Identify the primary intent.
2. Check `references/capability-map.md`.
3. If a specialist exists, read that skill before work begins.
4. If no specialist exists, proceed with general assistance and name the gap plainly.
5. If the request might need research before another artefact, ask the user rather than assuming.

## Routing matrix

- Research, evidence gathering, competitor scan, trend scan, best-practice review -> `skills/research/SKILL.md`.
- Synthesis of supplied source material -> `skills/research/SKILL.md`, skipping source discovery.
- Figma write-side mutation -> `skills/figma-writing/SKILL.md`.
- Static design artefact critique, UX critique, heuristic review, or visual accessibility review -> `skills/design-critique/SKILL.md`.
- Wireframes, prototypes, slide decks -> future specialist skills; use general assistance for now unless the user explicitly asks for research first.

## Ambiguous requests

When a request could reasonably fit more than one route, ask one concise
question. Prefer questions that distinguish the user's desired output:

- "Do you want new evidence gathered, or synthesis of material you already have?"
- "Do you want research first, or should I go straight to the prototype/deck/wireframe?"
- "Is the goal to edit Figma, or to critique the design artefact without changing it?"
- "Do you want a source-grounded critique of the artefact, or new external research first?"

## Verification

Before answering, check that the selected route still matches the user's output
request. If the work has drifted into a different route, pause and realign with
the user.
