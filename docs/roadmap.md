# Roadmap

This is the working backlog for capabilities the suite should grow into. Keep it focused on intended product direction rather than implementation history. When an item becomes active work, create a spec in `docs/specs/` and an implementation plan in `docs/plans/` or `docs/superpowers/plans/`.

## Product Direction

`claude-product-suite` is a modular toolbox for product teams, not a prescribed product lifecycle. Users may arrive with any product, design, research, testing, communication, or creative workflow need. The suite should help them use the right specialist tool for the current job without forcing an A/B/C process.

Skills should be useful independently and composable when the user asks for a connected workflow. The router should classify the job-to-be-done, route to implemented specialists, avoid unnecessary pre-steps, and name future capabilities plainly.

## Toolbox Areas

### Thinking and strategy

- [x] Add a standalone brainstorming skill for design concepts, product ideas, positioning angles, UX flow options, feature shaping, copy ideation, and experiment ideas. It borrows the useful shape of Superpowers brainstorming while staying tailored to product, design, and creative work rather than engineering implementation.
- [ ] Add product brief and strategy-document support as a toolbox item for clarifying, critiquing, rewriting, comparing, or converting product docs into actionable next steps without making briefs the mandatory front door.
- [ ] Consider prioritisation and decision-framing playbooks once brief processing and brainstorming have real examples.

### Evidence and discovery

- [x] Provide source-led research, competitor scans, best-practice review, and supplied-source synthesis through `skills/research/`.
- [x] Provide Contentsquare-only analysis support through `skills/contentsquare-analysis/`, covering question framing, MCP capability checks, measurement validation, CS playbooks, and standardised outputs.
- [ ] Expand research examples and playbooks as repeated product-team request patterns appear.

### Design quality

- [x] Provide static artefact UX critique, heuristic review, and visual accessibility review through `skills/design-critique/`.
- [ ] Add narrower critique playbooks if common requests emerge, such as onboarding review, conversion review, dashboard review, or mobile flow review.

### Making artefacts

- [x] Provide safe Figma write-side operations through `skills/figma-writing/` v1.
- [x] Add a design-system-safe Figma playbook for frames, components, tables, charts, graphs, dashboards, variables, modes, Code Connect, and auto-layout sizing.
- [ ] Continue Figma writing as an experimental deep track. Durable lessons should be captured through `/figma-learn` and promoted into bundled helpers, pitfalls, or playbooks only when they are reliable.
- [ ] Add a progressive-disclosure maintenance pass for `figma-writing`: split the growing pitfalls catalogue into category-specific references once it starts costing context, keeping `SKILL.md` as the lean router and turning `pitfalls.md` into an index.
- [ ] Expand the Figma skill with wireframing support. Wireframing should live inside the Figma capability area because the likely output surface is Figma, not a separate standalone workflow.
- [x] Add Figma chart, graph, and table generation guidance through the design-system-safe Figma playbook. Current coverage is playbook-level: use real components, variables, modes, auto-layout sizing, editable table-like structures, and truthful chart primitives; helper automation remains a future improvement.
- [ ] Add a prototyping skill for producing high-fidelity prototypes from Figma designs or other sources. It should gather the information Claude needs before building and steer implementation toward the suite backend and frontend design principles rather than a monolithic React app.
- [ ] Define prototyping standards for a centralised design library, reusable components, clear project structure, and adequate documentation.
- [ ] Promote durable `figma-writing` lessons from real builds into bundled helpers, pitfalls, or playbooks (gate on reliability per the experimental-track note above). Candidates surfaced while building a multi-section research board:
  - [ ] Add element-*creation* helpers such as `createStyledText` and `createCard`. Current helpers only mutate existing nodes, so from-scratch builds re-implement text/card creation in every script. A `createCard` should encode the FIXED-width frame + `FILL` children recipe.
  - [ ] Document a text-hyperlink technique (`node.hyperlink = {type:'URL', value}` after font load + characters, with underline + link fill).
  - [ ] Add an inspection pitfall: `get_metadata` on a large page or frame exceeds the token budget; probe instead with a compact read-only `use_figma` projection (`{id,name,x,y,w,h}` for children, `{id,chars}` for text).
  - [ ] Document a measure-then-place stacking recipe for hug-height cards in absolutely-positioned boards (create card, read rendered `.height`, place the next below).
  - [ ] Add a "revise an existing artefact" operation type: probe-then-patch-by-id, scoped to the subtree root rather than `currentPage.findAll`, so copy edits don't disturb sibling nodes.
  - [ ] Clarify the Fonts guidance for create-vs-mutate: the "don't construct fonts from intent" rule is a mutation rule; when creating, verify with `listAvailableFontsAsync` then construct from intent.
  - [ ] Split `references/pitfalls.md` into focused files when it grows beyond a useful single-pass reference, likely `pitfalls/auto-layout.md`, `pitfalls/text-and-fonts.md`, `pitfalls/api-quirks.md`, `pitfalls/verification.md`, `pitfalls/style-matching.md`, and `pitfalls/tables.md`.
- [ ] **Needs further consideration:** codify a reusable "research summary board" output — a canonical multi-column layout (Define/Verdict · Key Findings + source cards · Recommendation + caveat · What to build DO/DON'T · Sources) that renders the `research` skill's Default output shape onto canvas. Open questions: split ownership between a Figma-agnostic information-architecture reference in `skills/research/` and a render playbook in `skills/figma-writing/` (extending `build-nodes-matching-existing-style`); and whether the visual style should clone a host reference board when present or fall back to default tokens.

### Delivery shaping and refinement

- [ ] Add a BA/product-delivery shaping skill for turning workshop notes, stakeholder asks, process maps, and rough requirements into delivery-ready artefacts. Initial colleague feedback points to process map -> epics -> features -> requirements for ADO, INVEST reviews, alternate user stories for the same requirement, and gap/ambiguity checks before refinement.
- [ ] Define ADO-oriented output patterns for epics, features, PBIs or user stories, acceptance criteria, assumptions, open questions, dependencies, and traceability from need to delivery item.
- [ ] Capture anonymised BA/PO examples before implementation so the skill can learn what "good enough for ADO/refinement" means without over-prescribing one delivery process.

### Testing and iteration

- [x] Provide UserTesting.com workflow support through `skills/usertesting/`, including audience and screener definition, concise low-bias test scripts, export guidance, and compact qualitative synthesis.
- [ ] Decide whether user testing outputs need reusable report templates, richer visual artefacts, or should stay as playbook-driven narrative outputs.
- [ ] Consider experiment planning and iteration-planning support after user testing workflows are clearer.

### Communication

- [ ] Add slide-deck generation and synthesis support for packaging research, critique, testing findings, strategy, or product decisions into stakeholder-ready narratives.
- [ ] Add product narrative and stakeholder-update playbooks if they show up as repeated product-team needs.

## Near-Term Priorities

- [ ] Validate the current Figma writing track with the hand-test guide against a real editable Figma file, then promote only durable lessons into helpers, pitfalls, playbooks, or docs.
- [ ] Shape the next specialist skill brief before implementation starts. Product/design brainstorming is implemented; deeper UserTesting.com report-template work remains a testing-and-iteration follow-up.
- [ ] Decide the first external-sharing path: keep private for more hand-testing, share with named colleagues, or open the GitHub repo.
- [ ] Keep install, update, changelog, release, and contribution docs accurate as plugin distribution matures.
- [ ] Revisit roadmap priorities after the next real-world use of research, design critique, or Figma writing reveals repeated request patterns.

## Parking Lot

- [ ] Decide whether local learning files should get an optional import path into personal skills.
- [ ] Create public contribution guidance for skill improvements, including when to open an issue, fork, or submit a pull request.
- [ ] Add GitHub issue templates if the repo becomes public.
- [ ] Consider release automation once manual SemVer, changelog, and tag discipline have settled.
