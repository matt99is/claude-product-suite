---
description: "Capture a new Figma writing learning as local learning, or prepare a maintainer project change when explicitly requested."
---

You are capturing a new learning about Figma writing that emerged during this
session. The goal is to make sure it survives the conversation as a
structured local learning entry for the user. Public users should build their
local skillset; maintainer improvements to `figma-writing` are normal project
work.

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

Wait for approval before recording local learning.

Iterate until the user approves.

## 5. Capture local learning

Default public behavior is local learning. Record the approved draft in a
user-local place such as:

```text
~/.claude-product-suite/learnings/figma-writing.md
```

Include the date, category, draft content, and any source context needed to make
the note useful later. Do not edit files under `skills/figma-writing/` unless the
user explicitly asks to change this project. Do not run `git commit` by default.

## Maintainer project changes

If the user says they are maintaining `claude-product-suite` itself, treat the
learning as normal project work instead of local learning:

- propose the source change and get approval;
- edit the relevant skill, pitfall, playbook, helper, or test file;
- run the appropriate checks;
- create a local repo commit only after approval.

A maintainer commit may use:

```bash
git add <changed-paths>
git commit -m "learn(figma): <one-line summary>"
```

Never push to GitHub from this command unless the user separately asks for a
push.
