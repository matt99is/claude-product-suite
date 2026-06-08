# Brainstorming Skill Design

## Purpose

Add a dedicated `brainstorming` skill for product, design, strategy, and creative
ideation. The skill should help users move from fuzzy thoughts to useful
options, sharper concepts, and practical next steps without becoming a mandatory
front door for every product-team request.

The skill should own possibility generation and concept shaping. It should not
own evidence gathering, artefact critique, UserTesting.com workflows, Figma
mutation, implementation planning, or source-backed synthesis.

## Fit With The Suite

`claude-product-suite` is a modular toolbox, not a prescribed product lifecycle.
The brainstorming skill fits as an independent thinking-and-strategy tool that
users can invoke when they want to explore, shape, compare, or narrow ideas. It
should be composable with other skills only when the requested output naturally
requires a handoff.

The skill should reinforce existing suite boundaries:

- Use `research` for source-backed evidence, best practices, competitor scans,
  market scans, trend scans, and supplied-source synthesis.
- Use `design-critique` for critique, review, audit, scoring, or problem-finding
  against a static artefact.
- Use `usertesting` for UserTesting.com study planning, script review, export
  guidance, or results synthesis.
- Use `figma-writing` for write-side Figma mutation, cloning, text updates,
  variant generation, or setup troubleshooting.

## Recommended Approach

Use a hybrid skill with explicit modes:

- `Diverge`: generate broad options, concepts, names, angles, or ideas.
- `Shape`: turn a fuzzy or incomplete idea into a coherent concept.
- `Compare`: evaluate known options against decision criteria.
- `Narrow`: recommend a direction, priority, MVP slice, or next move.
- `Translate`: turn a chosen idea into a lightweight brief or handoff prompt for
  another workflow.

Default behavior should be: start expansive enough to avoid premature narrowing,
then converge lightly so the user leaves with a practical next step. If the mode
is unclear, default to `Shape` unless the user clearly asks for breadth or a
decision.

## Mode Selection

The skill should infer mode from the user's verb and desired output:

- Use `Diverge` for "brainstorm", "generate", "give me ideas", "options",
  "angles", "directions", "names", or "what could we do?"
- Use `Shape` for "make this clearer", "develop this idea", "turn this rough
  thought into a concept", or incomplete product/design ideas.
- Use `Compare` for "which is stronger?", "compare these", "tradeoffs", or known
  alternatives.
- Use `Narrow` for "what should we do first?", "recommend", "prioritize", "MVP",
  or "next move".
- Use `Translate` for "turn this into a brief", "handoff", "prompt", "test
  idea", "deck outline", or another concrete downstream artefact.

Ask one clarifying question only when the desired output could materially route
to different skills or modes.

## Output Shape

Default output should be concise and actionable:

1. Goal recap
2. Assumptions and constraints
3. Options or shaped concept
4. Themes, comparison, or tradeoffs as appropriate
5. Strongest directions
6. Suggested next step

For broad ideation, avoid endless lists by grouping ideas into themes. For
decision-oriented work, include criteria and what would change the
recommendation.

## Quality Bar

Outputs should be:

- Specific enough to be discussed or acted on.
- Audience-aware.
- Varied across genuinely different directions.
- Honest about assumptions and confidence.
- Clear about which points are creative possibilities rather than validated
  claims.
- Practical enough to support a next decision or artefact.

Avoid generic product cliches, idea soup, unlabelled assumptions, premature
convergence, and pretending brainstormed ideas are evidence.

## Files

Implementation should add:

- `skills/brainstorming/SKILL.md`
- `skills/brainstorming/references/brainstorming-quality-bar.md`
- `skills/brainstorming/references/brainstorming-pitfalls.md`
- `skills/brainstorming/playbooks/shape-and-generate.md`
- `skills/brainstorming/playbooks/compare-and-narrow.md`

Implementation should update:

- `skills/product-suite-router/SKILL.md`
- `skills/product-suite-router/references/capability-map.md`
- `skills/product-suite-router/references/routing-pitfalls.md`
- `README.md`
- `docs/roadmap.md`
- `CHANGELOG.md`
- `package.json`
- `.claude-plugin/plugin.json`
- `tests/skill-content-contracts.test.js`

## Release

Adding a new skill is a minor release. The next plugin version after `0.3.0`
should be `0.4.0`.

## Success Criteria

- Claude can discover `brainstorming` as an installed skill.
- The router directs product/design ideation, concept shaping, option
  generation, and idea narrowing to `brainstorming`.
- The router still directs research, critique, UserTesting.com, and Figma
  mutation requests to their specialist skills.
- Tests cover the skill content, router updates, README mention, and version
  sync.
- `npm test` and `npm run check` pass.
