# Evidence Synthesis

## When to use

Use this when the user supplies source material, notes, transcripts, documents,
or links and asks for synthesis rather than new source discovery.

## What Claude needs first

- The supplied source material.
- The question or decision the synthesis must inform.
- The desired output format.
- Whether additional research is allowed or out of scope.

## Steps

1. Confirm that the task is synthesis of supplied source material.
2. Skip source discovery unless the user asks for additional research.
3. Inventory the supplied sources or notes.
4. Identify the main themes, agreements, contradictions, and gaps.
5. Preserve citations, URLs, file names, or source references from the supplied
   material wherever possible.
6. Separate source-backed findings from analyst inference.
7. Identify confidence and gaps.
8. Translate findings into UX/product implications.
9. Recommend next actions or follow-up research where useful.

## Output

Recommended output:

- Synthesis question
- What the supplied sources show
- Key themes
- Contradictions or tensions
- Gaps and confidence
- UX/product implications
- Recommended next actions
- Source references or clean URL list if URLs were supplied

## Common failures

- **New research sneaks in.** Do not browse or add external evidence unless the
  user asks for it.
- **Source references are lost.** Preserve the user's original references so the
  synthesis remains auditable.
- **Inference is hidden.** Label interpretation and recommendation separately
  from supplied evidence.
