# Product Suite Capability Map

This map tells the router which skills exist, which are partial, and which are
future capability. Update it only when a skill has a usable `SKILL.md` and
supporting references or playbooks that change Claude's behavior.

| Capability | Status | Route |
|---|---|---|
| Research | Implemented | `skills/research/SKILL.md` |
| Evidence synthesis | Implemented | `skills/research/SKILL.md` |
| Figma writing | Existing partial v1 | `skills/figma-writing/SKILL.md` |
| Design critique | Implemented | `skills/design-critique/SKILL.md` |
| Figma design-system-safe creation | Future improvement | Use current `figma-writing` guard for write-side safety; do not claim full creation coverage |
| Wireframing | Future | General assistance until a dedicated skill exists |
| Prototyping | Future | General assistance until a dedicated skill exists |
| Slide decks | Future | General assistance until a dedicated skill exists |
| Product brief processing | Future or research-adjacent | Use `research` only when evidence gathering or source-led synthesis is requested |

## Routing Defaults

- Route research and source-led synthesis to `research`.
- Route Figma mutations to `figma-writing`.
- Route static artefact UX critique, heuristic review, and visual-accessibility critique to `design-critique`.
- Do not route decks, prototypes, wireframes, or Figma work through research by default.
- When a future capability is requested, help with general reasoning and say that
  the suite does not yet have a dedicated specialist skill for that capability.

## Future Capability Rule

Future capability means "known direction", not "implemented behavior". Do not
invent playbooks, helpers, or guarantees for future capability areas until their
skill folders exist.
