# Product Suite Routing Pitfalls

Each entry uses the same four-part format as other suite references: **Symptom**,
**Cause**, **Correct pattern**, **When this matters**.

---

## Over-routing

### Research becomes a tax on every downstream task

#### Symptom
A user asks for a prototype, deck, wireframe, or Figma edit, and the response
starts a research workflow even though the user did not ask for evidence
gathering.

#### Cause
The router treats research as a universal gate instead of a peer specialist
skill.

#### Correct pattern
Preserve the primary intent. Route directly to the requested artefact workflow
when one exists. If external evidence is clearly missing, ask whether the user
wants research first.

#### When this matters
Deck, prototype, wireframe, Figma, and brief-processing requests.

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
synthesis, or a competitor scan is the user's goal.

#### When this matters
Research, evidence, market scan, competitor scan, trend scan, and best-practice
requests.

---

## False Capability

### Future capability is described as implemented

#### Symptom
The response claims the suite can create decks, prototypes, wireframes, or full
design-system-safe Figma compositions through a dedicated skill when that skill
does not exist yet.

#### Cause
The router confuses the capability roadmap with the installed capability set.

#### Correct pattern
Use `references/capability-map.md`. If the capability is future capability, say
so plainly and proceed with general assistance.

#### When this matters
Any request in a roadmap area that has no real skill folder yet.

---

## Chain Inflation

### Too many skills are invoked for one straightforward request

#### Symptom
A simple request becomes a multi-skill workflow with unnecessary setup,
handoffs, or clarifying questions.

#### Cause
The router optimizes for possible relevance rather than the user's primary
intent and expected output.

#### Correct pattern
Choose the smallest route that satisfies the request. Chain skills only when the
user asks for a sequence or when one specialist output is explicitly needed as
input to another.

#### When this matters
Broad UX/product requests where research, briefs, prototypes, decks, and Figma
could all be related but are not all required.

---

## Ambiguity Drift

### Ambiguous request is treated as certain

#### Symptom
The response assumes the user wants evidence gathering when they wanted
synthesis, or assumes artefact production when they wanted research.

#### Cause
The router fails to clarify the intended output.

#### Correct pattern
Ask one concise question that distinguishes research, synthesis, and artefact
production.

#### When this matters
Requests like "look into this", "turn this into a prototype", "make a brief",
or "what should we do about this?"
