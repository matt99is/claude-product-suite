# Roadmap

This is the working backlog for capabilities the suite should grow into. Keep it focused on intended product direction rather than implementation history. When an item becomes active work, create a spec in `docs/specs/` and an implementation plan in `docs/plans/` or `docs/superpowers/plans/`.

## Now

- [ ] Run the Figma helper hand-test against a real Figma file and capture any durable lessons through `/figma-learn`.
- [ ] Decide the first public-sharing path: keep private, share with named colleagues, or open the GitHub repo.
- [ ] Keep install, update, changelog, and release docs accurate as plugin distribution matures.
- [ ] Shape the next specialist skill brief before implementation starts.

## Next

- [ ] Expand the Figma skill with wireframing support. Wireframing should live inside the Figma capability area because the likely output surface is Figma, not a separate standalone workflow.
- [ ] Add Figma chart, graph, and table generation. These should help users create accurate, editable design artefacts for data-heavy work, including sensible defaults for axes, legends, labels, series styling, table structure, empty states, and design-system-safe visual treatment.
- [ ] Add a user testing skill for people using UserTesting.com to run testing with real users. It should help set up testing scenarios, choose audiences, consume exported UserTesting.com results, synthesize findings, and return them in the requested format such as Figma, PDF, slides, or another suitable deliverable.
- [ ] Add a standalone brainstorming skill for design concepts, product ideas, and copy ideation. It should borrow the useful shape of Superpowers brainstorming while staying tailored to product, design, and creative work rather than engineering implementation.
- [ ] Add a prototyping skill for producing high-fidelity prototypes from Figma designs or other sources. It should gather the information Claude needs before building and steer implementation toward the suite's backend and frontend design principles rather than a monolithic React app.
- [ ] Define prototyping standards for a centralised design library, reusable components, clear project structure, and adequate documentation.

## Later

- [ ] Add slide-deck generation and synthesis support once research, Figma, and prototyping workflows are more mature.
- [ ] Add product brief processing that can route naturally into research, Figma, brainstorming, user testing, deck, or prototype workflows.
- [ ] Create public contribution guidance for skill improvements, including when to open an issue, fork, or submit a pull request.
- [ ] Add GitHub issue templates if the repo becomes public.
- [ ] Consider release automation once manual SemVer, changelog, and tag discipline have settled.

## Parking Lot

- [ ] Decide whether local learning files should get an optional import path into personal skills.
- [ ] Decide whether user testing outputs need reusable report templates or should start as playbook-driven narrative outputs.
