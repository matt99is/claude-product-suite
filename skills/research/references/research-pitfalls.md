# Research Pitfalls

Each entry uses the same four-part format: **Symptom**, **Cause**, **Correct
pattern**, **When this matters**.

---

## Brief Quality

### Vague brief leads to unfocused research

#### Symptom
The source set is broad, findings feel generic, or the output does not help the
user make a decision.

#### Cause
Research began before the ask, decision context, audience, constraints, and
expected output were clear.

#### Correct pattern
Use `playbooks/brief-to-research-plan.md` before source collection. Clarify what
the research must inform and what kind of output the user needs.

#### When this matters
Any broad request such as "research this", "look into competitors", or "what
are best practices?"

---

## Evidence Integrity

### Synthesising from memory

#### Symptom
The answer sounds plausible but cannot point to specific sources read in the
current pass or supplied by the user.

#### Cause
Claude uses prior knowledge, source snippets, or old summaries as evidence.

#### Correct pattern
Never synthesise from memory, source descriptions, or prior summaries as
evidence. Use only read sources or material supplied by the user, and label
anything else as inference or background context.

#### When this matters
Every source-led research task.

### Weak sources carrying key claims

#### Symptom
A main recommendation rests on SEO content, vendor opinion, affiliate content,
or a stat roundup with unclear sourcing.

#### Cause
The source was included because it was easy to find, not because it was strong
enough to support the claim.

#### Correct pattern
Classify source quality before synthesis. Weak sources may support context or
examples, but must never carry key claims.

#### When this matters
Best-practice reviews, competitor scans, market scans, and trend research.

### Treating vendor opinion as independent evidence

#### Symptom
The output presents a vendor's opinion or marketing claim as if it were neutral
market evidence.

#### Cause
The source is substantive but self-interested, and the bias was not surfaced.

#### Correct pattern
Treat vendor and company sources as Medium unless they provide direct product
facts. Use them for examples or corroborated context, and identify the bias.

#### When this matters
SaaS, ecommerce, platform, tooling, and competitor research.

### Hiding inference as fact

#### Symptom
Recommendations and interpretation are mixed into findings as if directly
stated by sources.

#### Cause
The synthesis does not separate source-backed findings from analyst inference.

#### Correct pattern
Separate "what sources show" from "what this likely means". Use confidence and
caveat language for interpretation.

#### When this matters
Research outputs that include recommendations, risks, opportunities, or next
actions.

---

## Output Hygiene

### Source list not paste-ready for NotebookLM

#### Symptom
The user has to strip bullets, titles, markdown links, blank lines, or notes
before pasting sources into NotebookLM.

#### Cause
The research output treats the URL list as a citation section instead of a clean
utility output.

#### Correct pattern
End with a clean URL list: one URL per line, no markdown, labels, titles,
bullets, or blank lines.

#### When this matters
Any research task using external URLs, especially when the user may continue the
work in NotebookLM.
