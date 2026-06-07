# Product Suite Capability Map

This map tells the router which skills exist, which are partial, and which are
future capability. Update it only when a skill has a usable `SKILL.md` and
supporting references or playbooks that change Claude behavior.

The suite is a product-team toolbox, not a prescribed product lifecycle. A
request may enter through any area. Route to the tool that matches the current
job-to-be-done, and combine tools only when the user asks for a connected
workflow or one output is genuinely needed by another.

## Toolbox Areas

| Area | Capability | Status | Route |
|---|---|---|---|
| Evidence and discovery | Research | Implemented | `skills/research/SKILL.md` |
| Evidence and discovery | Evidence synthesis | Implemented | `skills/research/SKILL.md` |
| Design quality | Design critique | Implemented | `skills/design-critique/SKILL.md` |
| Making artefacts | Figma writing | Existing partial v1 | `skills/figma-writing/SKILL.md` |
| Making artefacts | Figma design-system-safe creation | Future improvement | Use current `figma-writing` guard for write-side safety; do not claim full creation coverage |
| Making artefacts | Wireframing | Future | General assistance until a dedicated skill exists |
| Making artefacts | Prototyping | Future | General assistance until a dedicated skill exists |
| Making artefacts | Figma charts, graphs, and tables | Future | General assistance until a dedicated skill exists |
| Thinking and strategy | Brainstorming | Future | General assistance until a dedicated skill exists |
| Thinking and strategy | Product brief processing | Future | General assistance unless evidence gathering or source-led synthesis is requested |
| Thinking and strategy | Prioritisation and decision framing | Future | General assistance until a dedicated skill exists |
| Testing and iteration | UserTesting.com workflows | Future | General assistance until a dedicated skill exists |
| Testing and iteration | Experiment planning | Future | General assistance until a dedicated skill exists |
| Communication | Slide decks | Future | General assistance until a dedicated skill exists |
| Communication | Stakeholder updates and product narratives | Future | General assistance until a dedicated skill exists |

## Routing Defaults

- Route research and source-led synthesis to `research`.
- Route Figma mutations to `figma-writing`.
- Route static artefact UX critique, heuristic review, and visual-accessibility critique to `design-critique`.
- Do not route decks, prototypes, wireframes, testing plans, brief processing, brainstorming, or Figma work through research by default.
- When a future capability is requested, help with general reasoning and say that the suite does not yet have a dedicated specialist skill for that capability.
- When the user asks for a connected workflow, use the smallest set of implemented skills that actually serve the requested output.

## Future Capability Rule

Future capability means "known direction", not "implemented behavior". Do not
invent playbooks, helpers, or guarantees for future capability areas until their
skill folders exist.
