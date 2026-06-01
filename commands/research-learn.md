---
description: "Capture a new research learning as local learning, or prepare a maintainer project change when explicitly requested."
---

You are capturing a new learning about the `research` skill that emerged during
this session. The goal is to make sure it survives the conversation as a
structured local learning entry for the user. Public users should build their
local skillset; maintainer improvements to the research skill are normal project
work.

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

Wait for approval before recording local learning.

## 5. Capture local learning

Default public behavior is local learning. Record the approved draft in a
user-local place such as:

```text
~/.claude-product-suite/learnings/research.md
```

Include the date, category, draft content, and any source context needed to make
the note useful later. Do not edit files under `skills/research/` unless the
user explicitly asks to change this project. Do not run `git commit` by default.

## Maintainer project changes

If the user says they are maintaining `claude-product-suite` itself, treat the
learning as normal project work instead of local learning:

- propose the source change and get approval;
- edit the relevant pitfall, source-quality, playbook, output-format, or test
  file;
- run the appropriate checks;
- create a local repo commit only after approval.

A maintainer commit may use:

```bash
git add <changed-paths>
git commit -m "learn(research): <one-line summary>"
```

Never push to GitHub from this command unless the user separately asks for a
push.
