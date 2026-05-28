# Clone frame with text updates

## When to use
You need to duplicate a frame and change one or more text strings in the
duplicate, while preserving every design-system link in the original.

## What Claude needs first
- The source node ID or a unique name selector (e.g. `Button/Primary`).
- The list of text changes, either as a map `{ oldText: newText }` or as
  positional pairs `[layerName, newText]`.
- The target parent (often the same parent as the source).
- The insert index inside the target parent if it is auto-layout. If
  omitted, the clone will be appended with a warning.

## Pre-flight reads
- `references/pitfalls.md` sections:
  - Fonts (both entries)
  - Design-system bindings (both entries)
  - Sibling instances with identical paths
  - Auto-layout (both entries)
- Helpers used:
  - `cloneAndRebind`
  - `matchTextNodesByIndex`
  - `setTextPreservingBindings`

## Steps

1. Find the source node and confirm its type. If it is an instance, confirm
   it is an instance of a published component, not a detached copy. Detached
   copies have no bindings to preserve.
2. Identify the target parent and the insert index. If the parent is
   auto-layout, an explicit numeric index is strongly preferred.
3. Call `await cloneAndRebind(source, parent, insertIndex)`. Capture
   `result.value` (the clone) and `result.warnings`.
4. Call `matchTextNodesByIndex(source, result.value)` to pair the source's
   text nodes with the clone's. If this throws on count mismatch, stop and
   investigate: the clone is structurally different from the source and
   pair-by-index would silently misalign updates.
5. For each pair, decide whether the text in the clone needs updating.
   Apply updates via `await setTextPreservingBindings(targetText, newText)`.
   Accumulate warnings.
6. Take a screenshot of the target parent frame.
7. Compare the screenshot against the operation's intent. If the result
   matches, surface the accumulated warnings to the user and finish. If it
   does not match, screenshot intermediate states (the clone alone, the
   source for comparison) and read the relevant pitfalls section before
   iterating.

## Common failures

- **Parent grew unexpectedly.** A text re-wrapped inside auto-layout.
  Inspect the text node's `textAutoResize`. Do not change it. If the
  re-wrap is the intended outcome, surface that to the user.
- **Second sibling instance lost its update.** Path-keyed matching was used
  somewhere instead of `matchTextNodesByIndex`. Confirm the helper was
  called by name and not re-implemented inline.
- **Style drifted between source and clone.** Bindings broke during the
  mutation. Confirm `setTextPreservingBindings` was used, not
  `node.characters = ...` directly. Re-run with the helper.
- **Font fallback warning.** The requested font was not loadable in the
  cloud renderer. Stop. Surface the warning to the user. Do not
  silently proceed with Inter.
