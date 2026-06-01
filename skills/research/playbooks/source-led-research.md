# Source-Led Research

## When to use

Use this when the user wants new research based on external sources.

## What Claude needs first

- A useful brief or enough information to create one.
- The expected depth and output format.
- Any must-use or must-avoid source types.
- Whether the user wants a clean URL list for optional NotebookLM use.

## Pre-flight reads

- `../references/source-quality.md`
- `../references/research-pitfalls.md`

## Steps

1. Confirm or create the brief.
2. Translate the brief into research questions.
3. Gather candidate sources from a mix of primary, credible secondary, and
   example sources.
4. Read candidate sources before using them.
5. Classify serious candidate sources by trust tier and allowed use.
6. Exclude weak, duplicative, stale, or unretrievable sources from key evidence.
7. Synthesize findings only from sources read in this pass or supplied by the
   user.
8. Separate source-backed findings from inference.
9. Translate findings into UX/product implications.
10. Provide caveats, confidence, and recommended next actions.
11. End with a clean URL list: one URL per line, no markdown or labels.

## Source notes

For each important source, track:

- URL
- Trust tier
- Allowed use
- Why it matters to the brief
- Any caveat or bias

## Output

Default output:

1. Brief recap
2. Executive summary
3. Key findings
4. Evidence table or source notes
5. UX/product implications
6. Risks, caveats, and confidence
7. Recommended next actions
8. Clean URL list

## Common failures

- **Candidate sources are weak.** Keep looking for stronger primary or editorial
  sources before writing key claims.
- **The source set repeats one claim.** Prefer unique evidence over slot-filling.
- **The output is descriptive only.** Add UX/product implications tied to the
  user's decision.
- **The URL list is not clean.** Remove bullets, markdown links, titles, and
  blank lines.
