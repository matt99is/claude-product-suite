---
name: research
description: Use when the user asks to research a subject, gather evidence, compare competitors, review best practices, scan a market or trend, or synthesize supplied sources into UX/product implications.
---

# research

This skill governs source-led research for UX and product work. It helps Claude
start with the right brief, gather the right evidence, and turn that evidence
into useful synthesis without pretending memory or weak sources are proof.

NotebookLM is optional. The skill always works without it, but research output
should include a paste-ready URL list when external sources are used.

## Non-negotiables

1. Start with a useful brief before source collection.
2. Never synthesise from memory, source descriptions, or prior summaries as evidence.
3. Only use sources read in the current pass or supplied by the user.
4. Separate source-backed findings from analyst inference.
5. Weak sources must not carry key claims.
6. Always include a clean URL list when new external sources are used.
7. NotebookLM is optional; do not require it.

## Pre-flight checklist

Before doing research work:

1. Identify whether the task is new research or synthesis of supplied material.
2. If the ask is vague, use `playbooks/brief-to-research-plan.md`.
3. If collecting sources, read the source quality guide at `references/source-quality.md`.
4. Pick the matching playbook.
5. Confirm the expected output shape with the user when stakes or scope are unclear.

## Playbook router

- Vague or early research ask -> `playbooks/brief-to-research-plan.md`.
- New source discovery and synthesis -> `playbooks/source-led-research.md`.
- Synthesis of supplied source material -> `playbooks/evidence-synthesis.md`.
- Competitor, comparator, or example scan -> `playbooks/competitor-scan.md`.

## Default output shape

1. Brief recap
2. Executive summary
3. Key findings
4. Evidence table or source notes
5. UX/product implications
6. Risks, caveats, and confidence
7. Recommended next actions
8. Clean URL list

## Clean URL list rule

When external sources are used, end with a section containing one URL per line,
with no markdown labels, titles, bullets, or blank lines between entries.

## Verification

Before presenting findings, check:

- Every key claim points back to a read or supplied source.
- Inference and recommendation are labelled as interpretation, not source fact.
- Weak sources are used only for supporting context or examples.
- The clean URL list contains only URLs actually used or seriously selected.
