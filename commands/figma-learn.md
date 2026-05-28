---
description: "Capture a new Figma writing learning as a structured pitfall, playbook step, or helper TODO. Commits it."
---

You are capturing a new learning about Figma writing that emerged during this
session. The goal is to make sure it survives the conversation as a
structured, committed entry in the `figma-writing` skill.

Follow these five steps in order.

## 1. Identify the learning

If the user supplied a description as command args, use it. Otherwise ask:

> "What did you learn? Phrase it as a symptom (what looked wrong) or a rule
> (what to do instead). One or two sentences is enough."

Wait for an answer before continuing.

## 2. Classify the learning

Decide which of these four categories it belongs to. If unsure, propose the
most likely category and ask the user to confirm or correct.

- **New pitfall.** A trap not currently covered in `references/pitfalls.md`.
  This is the most common case.
- **Refinement of an existing pitfall.** An entry already exists but the
  symptom, cause, correct pattern, or applicability needs updating.
- **New playbook step or new playbook.** A step is missing from an existing
  playbook, or a whole new operation should be documented.
- **Helper TODO.** The learning suggests a code change to
  `helpers/figma-helpers.js` rather than documentation. Do not auto-edit
  helper code. Capture the change as a TODO note inside the pitfall entry.

## 3. Draft the entry

For a new pitfall, produce a draft in this exact format:

```markdown
### <Short title naming the trap>

#### Symptom
What looks wrong. What the user notices.

#### Cause
Why it happens. One or two sentences.

#### Correct pattern
What to do instead. Reference a helper if one exists, otherwise the manual
steps. If a helper TODO, write that here.

#### When this matters
Which operations this surfaces in.
```

For a refinement, show the existing entry and the proposed diff.

For a playbook change, draft the new step or playbook stub in the same
format as the existing playbooks under `skills/figma-writing/playbooks/`.

## 4. Show the draft to the user

Present the draft and ask:

> "Does this capture it? Edit the wording or tell me to change classification."

Iterate until the user approves.

## 5. Apply and commit

- For a new pitfall: append the entry under the appropriate category in
  `skills/figma-writing/references/pitfalls.md`. If a new category is
  needed, create it.
- For a refinement: edit the existing entry in place.
- For a playbook change: edit or create the relevant file under
  `skills/figma-writing/playbooks/`.
- For a helper TODO: record it as a pitfall entry whose Correct pattern
  reads `TODO(helper): <description>`. The next time helper code is
  changed, address the TODO in a real code change with tests.

Stage the changed files and commit with:

```bash
git add <changed-paths>
git commit -m "learn(figma): <one-line summary>"
```

End by showing the user the commit hash and a short summary of what was
added or changed.
