# Scrub AI Tropes

## When to use

Use this when the user supplies existing text and asks to remove AI tropes,
humanize it, make it sound less generic, tighten it, make it more direct, or
polish the style.

## Pre-flight reads

- `../references/plain-writing-quality-bar.md`
- `../references/ai-trope-watchlist.md`

## Steps

1. Diagnose before rewriting. Identify the main style problem: vague meaning,
   inflated tone, structural tells, repetitive cadence, or weak audience fit.
2. Preserve the user's meaning, factual claims, and level of certainty.
3. Remove structural tells first:
   - Replace em dash dependence with clearer punctuation or separate sentences.
   - Replace `not just X, but Y` with a direct claim.
   - Break rule of three lists unless all three items are specific and needed.
4. Replace vague abstractions with specific nouns and verbs.
5. Cut throat-clearing and generic transitions.
6. Vary sentence rhythm by meaning.
7. Check tone against the audience and channel.
8. Do a final trope pass using the watchlist.

## Output options

Default to the revised copy only when the user asks for a quick rewrite.

Use before and after when the user asks to learn from the edit, compare options,
or review style changes:

| Before | After | Why |
|---|---|---|
| Source phrase | Revised phrase | Specific trope or tradeoff |

## Common failures

- **Over-sanitizing.** Removing all personality can make copy sound more generic.
  Keep texture that sounds intentional and audience-appropriate.
- **Changing the claim.** Trope scrubbing is not permission to invent stronger
  facts.
- **Leaving structure untouched.** Replacing "delve" with "explore" is not
  enough if the paragraph still has a synthetic shape.
- **Overexplaining the edit.** Most users want better copy, not a lecture.
