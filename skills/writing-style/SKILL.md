---
name: writing-style
description: Use when the user asks to write, edit, rewrite, tighten, humanize, de-AI, remove AI tropes, improve tone, match voice, polish copy, draft prose, or review writing style for product, design, research, stakeholder, marketing, or general communication. Routes plain-language drafting and trope-scrubbing work.
---

# writing-style

This skill helps Claude draft and edit useful prose without defaulting to common
AI tropes. It is a practical writing guard, not a brand-voice system and not an
AI-detector evasion tool.

## Non-negotiables

1. Preserve user intent, facts, audience, and desired level of polish.
2. Start from purpose: what the writing must help the reader understand, decide,
   or do.
3. Prefer plain-language, concrete claims, specific nouns and verbs, and natural
   sentence rhythm.
4. Scrub AI tropes at the level of structure, not only vocabulary.
5. Treat the trope watchlist as diagnostic, not a banned-word list.
6. Flag and usually remove em dash dependence, `not just X, but Y` contrast, and
   rule of three cadence unless the user explicitly wants that rhetorical style.
7. Do not optimize for AI detectors. Improve clarity, usefulness, and voice
   instead.
8. Do not add fake warmth, invented evidence, inflated certainty, or generic
   "human" quirks.
9. If matching a named voice or brand, ask for or use supplied examples before
   claiming a close match.
10. Keep edits proportional: a light polish should not become a rewrite.

## Pre-flight checklist

Before writing or editing:

1. Identify the requested output: draft, rewrite, critique, style pass, tone
   options, or before/after edit.
2. Identify audience, purpose, channel, and constraints from the prompt. If they
   materially affect the work and are missing, ask one concise question.
3. Read `references/plain-writing-quality-bar.md`.
4. Read `references/ai-trope-watchlist.md` for any request involving AI tropes,
   humanizing, de-AI, or polish that sounds too generic.
5. Choose the smallest useful playbook.

## Playbook router

- Editing existing text, removing AI tropes, humanizing, tightening, making copy
  sound less generic, or creating a before/after -> `playbooks/scrub-ai-tropes.md`.
- Drafting new text from notes, bullets, intent, or a rough ask ->
  `playbooks/draft-clear-copy.md`.

## Default output shapes

For a rewrite:

1. Revised copy.
2. Brief notes on what changed, only if useful.
3. Remaining assumptions or choices.

For a style critique:

1. Highest-impact issues.
2. Examples from the text.
3. Rewrite pattern or sample fix.

For new drafting:

1. Draft.
2. Optional alternates when tone or framing is genuinely open.
3. Any facts or inputs still needed.

## Routing boundaries

Use this skill for writing quality, voice, and style. Route to `research` when
the user needs source-backed evidence or fact finding. Route to
`design-critique` when the writing is part of a static visual artefact and the
main job is UX critique. Route to `usertesting` for study scripts and synthesis
unless the user only asks for a prose style pass.

## Verification

Before answering, check:

- The revised copy says the same true thing as the source unless the user asked
  for a new angle.
- The first sentence or heading earns its place.
- Abstract claims have been made concrete or removed.
- Em dash, `not just X, but Y`, rule of three, glossy transitions, and generic
  uplift language have been scrubbed where they are not serving a real purpose.
- The output does not mention AI detectors unless the user asked about them.
