# Roadmap

This is the working backlog for capabilities the suite should grow into. Keep it focused on intended product direction rather than implementation history. When an item becomes active work, create a spec in `docs/specs/` and an implementation plan in `docs/plans/` or `docs/superpowers/plans/`.

## Product Direction

`claude-product-suite` is a modular toolbox for product teams, not a prescribed product lifecycle. Users may arrive with any product, design, research, testing, communication, or creative workflow need. The suite should help them use the right specialist tool for the current job without forcing an A/B/C process.

Skills should be useful independently and composable when the user asks for a connected workflow. The router should classify the job-to-be-done, route to implemented specialists, avoid unnecessary pre-steps, and name future capabilities plainly.

## Toolbox Areas

### Thinking and strategy

- [ ] Add a standalone brainstorming skill for design concepts, product ideas, positioning angles, UX flow options, feature shaping, copy ideation, and experiment ideas. It should borrow the useful shape of Superpowers brainstorming while staying tailored to product, design, and creative work rather than engineering implementation.
- [ ] Add product brief and strategy-document support as a toolbox item for clarifying, critiquing, rewriting, comparing, or converting product docs into actionable next steps without making briefs the mandatory front door.
- [ ] Consider prioritisation and decision-framing playbooks once brief processing and brainstorming have real examples.

### Evidence and discovery

- [x] Provide source-led research, competitor scans, best-practice review, and supplied-source synthesis through `skills/research/`.
- [ ] Expand research examples and playbooks as repeated product-team request patterns appear.

### Design quality

- [x] Provide static artefact UX critique, heuristic review, and visual accessibility review through `skills/design-critique/`.
- [ ] Add narrower critique playbooks if common requests emerge, such as onboarding review, conversion review, dashboard review, or mobile flow review.

### Making artefacts

- [x] Provide safe Figma write-side operations through `skills/figma-writing/` v1.
- [ ] Continue Figma writing as an experimental deep track. Durable lessons should be captured through `/figma-learn` and promoted into bundled helpers, pitfalls, or playbooks only when they are reliable.
- [ ] Expand the Figma skill with wireframing support. Wireframing should live inside the Figma capability area because the likely output surface is Figma, not a separate standalone workflow.
- [ ] Add Figma chart, graph, and table generation. These should help users create accurate, editable design artefacts for data-heavy work, including sensible defaults for axes, legends, labels, series styling, table structure, empty states, and design-system-safe visual treatment.
- [ ] Add a prototyping skill for producing high-fidelity prototypes from Figma designs or other sources. It should gather the information Claude needs before building and steer implementation toward the suite backend and frontend design principles rather than a monolithic React app.
- [ ] Define prototyping standards for a centralised design library, reusable components, clear project structure, and adequate documentation.

### Testing and iteration

- [x] Provide UserTesting.com workflow support through `skills/usertesting/`, including audience and screener definition, concise low-bias test scripts, export guidance, and compact qualitative synthesis.
- [ ] Decide whether user testing outputs need reusable report templates, richer visual artefacts, or should stay as playbook-driven narrative outputs.
- [ ] Consider experiment planning and iteration-planning support after user testing workflows are clearer.

### Communication

- [ ] Add slide-deck generation and synthesis support for packaging research, critique, testing findings, strategy, or product decisions into stakeholder-ready narratives.
- [ ] Add product narrative and stakeholder-update playbooks if they show up as repeated product-team needs.

## Near-Term Priorities

- [ ] Validate the current Figma writing track with the hand-test guide against a real editable Figma file, then promote only durable lessons into helpers, pitfalls, playbooks, or docs.
- [ ] Shape the next specialist skill brief before implementation starts. Product/design brainstorming is now the strongest broad-use candidate; deeper UserTesting.com report-template work remains a testing-and-iteration follow-up.
- [ ] Decide the first external-sharing path: keep private for more hand-testing, share with named colleagues, or open the GitHub repo.
- [ ] Keep install, update, changelog, release, and contribution docs accurate as plugin distribution matures.
- [ ] Revisit roadmap priorities after the next real-world use of research, design critique, or Figma writing reveals repeated request patterns.

## Parking Lot

- [ ] Decide whether local learning files should get an optional import path into personal skills.
- [ ] Create public contribution guidance for skill improvements, including when to open an issue, fork, or submit a pull request.
- [ ] Add GitHub issue templates if the repo becomes public.
- [ ] Consider release automation once manual SemVer, changelog, and tag discipline have settled.
