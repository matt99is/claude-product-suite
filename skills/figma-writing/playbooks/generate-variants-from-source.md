# Generate variants from source

## When to use
You need to produce N copies of a source frame, each with its own set of
text changes, laid out beside or beneath the source.

## What Claude needs first
- The source node ID or unique name selector.
- The list of variants, each a `{ name?, changes: { layerName: newText, ... } }`.
- The target parent (often the source's parent).
- The layout direction inside the target if it is auto-layout. If the
  target is not auto-layout, the explicit x and y offsets per variant.

## Pre-flight reads
- `references/pitfalls/text-and-fonts.md` for font loading and text mutation.
- `references/pitfalls/style-matching-and-bindings.md` for design-system bindings.
- `references/pitfalls/auto-layout.md` for variant insertion and layout flow.
- `references/pitfalls/verification-and-collaboration.md` for screenshot verification.
- Helpers used:
  - `cloneAndRebind`
  - `matchTextNodesByIndex`
  - `setTextPreservingBindings`
  - `loadFontsForTextNode`

## Steps

1. Find the source node. Determine the source's index inside its parent;
   each variant will be inserted at index + 1, + 2, etc.
2. For each variant in order:
   a. Call `await cloneAndRebind(source, parent, insertIndex + i)`.
   b. If the target is not auto-layout, set the clone's `x` and `y` to the
      computed offsets.
   c. Call `matchTextNodesByIndex(source, clone)`.
   d. For each pair, look up the new text in the variant's `changes` map
      keyed by source text content or layer name. Apply via
      `await setTextPreservingBindings(target, newText)`.
   e. Accumulate warnings into the run total.
3. Take a screenshot of the target parent frame showing all variants.
4. Compare against intent. Surface accumulated warnings to the user.

## Common failures

- **Variants overlap.** The target parent is not auto-layout and explicit
  `x`/`y` offsets were not set per variant. Re-run with offsets or with the
  parent switched to auto-layout.
- **Variants render in wrong order.** `appendChild` was used instead of
  `insertChild` with a numeric index. Confirm `insertChildSafe` was called
  with an explicit index inside the loop.
- **Some variants did not update text.** The keying strategy did not match
  the actual text nodes. Switch to positional pair lookup
  (`matchTextNodesByIndex(...)[i]`) and ensure the variant's `changes` map
  is indexed against that.
- **Performance degrades for many variants.** Batch the screenshot to the
  end, not per variant. Each `get_screenshot` call is round-trip costly.
