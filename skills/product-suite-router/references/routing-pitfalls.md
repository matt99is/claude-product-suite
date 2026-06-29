# Product Suite Routing Pitfalls

Each entry uses the same four-part format as other suite references: **Symptom**,
**Cause**, **Correct pattern**, **When this matters**.

---

## Lifecycle forcing

### The toolbox is treated like a fixed process

#### Symptom
A user asks for one product, design, testing, or communication task, and the
response turns it into a prescribed lifecycle such as brief -> research -> design
-> testing -> deck.

#### Cause
The router treats product work as a universal sequence rather than a toolbox of
independent specialist skills.

#### Correct pattern
Classify the current job-to-be-done and route to the smallest implemented tool
that satisfies the requested output. Offer adjacent tools only as optional next
steps when they would clearly help.

#### When this matters
Any broad product-team request, especially brainstorming, briefs, critique,
research, testing, prototyping, decks, and Figma work.

---

## Over-routing

### Research becomes a tax on every downstream task

#### Symptom
A user asks for a prototype, deck, wireframe, testing plan, strategy document, or
Figma edit, and the response starts a research workflow even though the user did
not ask for evidence gathering.

#### Cause
The router treats research as a universal gate instead of a peer specialist
skill.

#### Correct pattern
Preserve the primary intent. Route directly to the requested artefact or workflow
when a specialist exists. If external evidence is clearly missing, ask whether
the user wants research first.

#### When this matters
Deck, prototype, wireframe, Figma, user testing, brainstorming, and
brief-processing requests.

---

## Under-routing

### Research asks become memory-based answers

#### Symptom
A user asks to research a subject, competitor, trend, or best practice, and the
response answers from memory without building a brief or reading sources.

#### Cause
The router treats "research" as a generic question rather than an explicit
source-led workflow.

#### Correct pattern
Route to `skills/research/SKILL.md` whenever evidence gathering, source-backed
synthesis, or a competitor scan is the user goal.

#### When this matters
Research, evidence, market scan, competitor scan, trend scan, and best-practice
requests.

---

## False Capability

### Future capability is described as implemented

#### Symptom
The response claims the suite can create decks, prototypes, wireframes, user
testing reports, product brief systems, or full design-system-safe Figma
compositions through a dedicated skill when that skill does not exist yet.

#### Cause
The router confuses the capability roadmap with the installed capability set.

#### Correct pattern
Use `references/capability-map.md`. If the capability is future capability, say
so plainly and proceed with general assistance.

#### When this matters
Any request in a roadmap area that has no real skill folder yet.

---

## Brainstorming Over-Capture

### Brainstorming swallows evidence, critique, testing, or mutation

#### Symptom
A user asks for best practices, competitor evidence, critique of a design,
UserTesting.com setup, or Figma edits, and the response starts generating ideas
instead of routing to the better specialist.

#### Cause
The router treats "brainstorming" as a generic product thinking mode rather than
a specialist for possibility generation and concept shaping.

#### Correct pattern
Use `skills/brainstorming/SKILL.md` for ideation, concept shaping, option
generation, and idea narrowing. Route source-backed evidence to `research`,
static artefact critique to `design-critique`, UserTesting.com workflows to
`usertesting`, and Figma mutation to `figma-writing`.

#### When this matters
Ambiguous requests such as "what should we do?", "what do you think of this?",
"test this", "review this", "best practice", "make variants", or "improve this
flow".

---

## Platform agnosticism

### Analytics gets flattened into generic advice

#### Symptom
A user asks for Contentsquare analysis and the response gives generic analytics
guidance without CS-specific validation, object IDs, MCP capability checks, or
UI handoff notes.

#### Cause
The router treats analytics platforms as interchangeable even though their
objects, metrics, and failure modes differ.

#### Correct pattern
Route Contentsquare requests to `skills/contentsquare-analysis/SKILL.md`. Keep
v1 CS-only and use its platform reference rather than inventing platform-neutral
rules.

#### When this matters
CS funnel, journey, page, segment, zone, error, dashboard, and stakeholder
reporting requests.

---

## Analytics overreach

### Contentsquare is asked to answer non-CS questions

#### Symptom
A response claims CS can explain source/channel, payment decline reason,
identity-provider behaviour, deploy ownership, BI revenue detail, or experiment
assignment without naming the blind spot.

#### Cause
The router mistakes "analytics" for one universal data source.

#### Correct pattern
Use `contentsquare-analysis` for CS evidence, then name non-CS blind spots and
route them to the project owner or external source outside the skill.

#### When this matters
Commercial, attribution, payment, identity, experimentation, server-log, and
release-causality questions.

---

## Chain Inflation

### Too many skills are invoked for one straightforward request

#### Symptom
A simple request becomes a multi-skill workflow with unnecessary setup,
handoffs, or clarifying questions.

#### Cause
The router optimizes for possible relevance rather than the user primary intent
and expected output.

#### Correct pattern
Choose the smallest route that satisfies the request. Chain skills only when the
user asks for a sequence or when one specialist output is explicitly needed as
input to another.

#### When this matters
Broad UX/product requests where research, briefs, prototypes, decks, critique,
testing, and Figma could all be related but are not all required.

---

## Ambiguity Drift

### Ambiguous request is treated as certain

#### Symptom
The response assumes the user wants evidence gathering when they wanted
synthesis, assumes artefact production when they wanted research, or assumes
critique when they wanted edits.

#### Cause
The router fails to clarify the intended output.

#### Correct pattern
Ask one concise question that distinguishes research, synthesis, critique,
testing, and artefact production.

#### When this matters
Requests like "look into this", "turn this into a prototype", "make a brief",
"test this", or "what should we do about this?"
