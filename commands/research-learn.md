---
description: "Capture a new research learning as a structured pitfall, playbook change, or output-format pattern. Commits it after approval."
---

You are capturing a new learning about the `research` skill that emerged during
this session. The goal is to make sure it survives the conversation as a
structured entry in the research skill.

Follow these five steps in order.

## 1. Identify the learning

If the user supplied a description as command args, use it. Otherwise ask:

> "What did you learn? Phrase it as a symptom, source-quality rule, synthesis
> trap, or output pattern. One or two sentences is enough."

Wait for an answer before continuing.

## 2. Classify the learning

Decide which of these categories it belongs to. If unsure, propose the most
likely category and ask the user to confirm or correct.

- **New pitfall.** A trap not currently covered in
  `skills/research/references/research-pitfalls.md`.
- **Refinement of an existing pitfall.** An existing pitfall needs updated
  symptom, cause, correct pattern, or applicability.
- **Source-quality rule.** A source pattern belongs in
  `skills/research/references/source-quality.md`.
- **Playbook change.** A step is missing from a playbook, or a new playbook is
  needed.
- **Output-format pattern.** A useful recurring output structure should be added
  to a playbook or reference.

## 3. Draft the entry

For a new research-pitfalls entry, produce a draft in this exact format:

```markdown
### <Short title naming the trap>

#### Symptom
What looks wrong. What the user notices.

#### Cause
Why it happens. One or two sentences.

#### Correct pattern
What to do instead. Reference a playbook or source-quality rule if one exists.

#### When this matters
Which research tasks this surfaces in.
```

For a source-quality change, draft the exact addition or edit.

For a playbook change, draft the new step or playbook stub in the same format as
the existing files under `skills/research/playbooks/`.

## 4. Show the draft to the user

Show the draft to the user and ask:

> "Does this capture it? Edit the wording or tell me to change classification."

Wait for approval before editing files.

## 5. Apply and commit

- For a new pitfall: append the entry under the appropriate section in
  `skills/research/references/research-pitfalls.md`.
- For a refinement: edit the existing entry in place.
- For a source-quality rule: edit
  `skills/research/references/source-quality.md`.
- For a playbook or output-format change: edit or create the relevant file under
  `skills/research/playbooks/`.

Stage the changed files and commit with:

```bash
git add <changed-paths>
git commit -m "learn(research): <one-line summary>"
```

End by showing the user the commit hash and a short summary of what was added or
changed.
