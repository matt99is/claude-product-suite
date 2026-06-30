# Hand-testing figma-helpers in real Figma

The helpers in `skills/figma-writing/helpers/figma-helpers.js` include
Figma API behavior that still needs real-file hand-testing even when unit tests
cover the pure-data and compatibility paths. Validate the write-side behavior
by running the script below against a real Figma file via the `use_figma` MCP
tool.

## Prerequisites

- A Figma file you can write to in the cloud renderer.
- The file contains at least one frame named `__handtest_source` containing:
  - One text node with a bound text style.
  - Optionally, a second text node and a non-text shape.
  - Ideally, one text node with mixed styled text segments, such as a bold
    prefix plus regular body copy.
- The file's auto-layout parent for inserts is named `__handtest_target`.

## Test script

Paste the contents of `skills/figma-writing/helpers/figma-helpers.js` at the
top of the `use_figma` script. Then run the following operation block:

```js
// === operation: hand-test ===
const source = figma.currentPage.findOne(n => n.name === '__handtest_source');
const target = figma.currentPage.findOne(n => n.name === '__handtest_target');
if (!source || !target) {
  return { ok: false, error: 'create __handtest_source and __handtest_target first' };
}

const warnings = [];

// 1. cloneAndRebind, including the auto-layout warning path
const c1 = await cloneAndRebind(source, target, 0);
warnings.push(...c1.warnings);

const c2 = await cloneAndRebind(source, target); // no index, expect a warning on auto-layout
warnings.push(...c2.warnings);

// 2. matchTextNodesByIndex + setTextPreservingBindings
const pairs = matchTextNodesByIndex(source, c1.value);
for (let i = 0; i < pairs.length; i++) {
  const r = await setTextPreservingBindings(pairs[i][1], `handtest-${i}-${Date.now()}`);
  warnings.push(...r.warnings);
}

// 3. snapshotStyleProfile + applyStyleProfile round-trip
const srcText = pairs[0][0];
const profile = await snapshotStyleProfile(srcText);
const apply = await applyStyleProfile(pairs[0][1], profile);
warnings.push(...apply.warnings);

return { ok: true, warnings, c1Id: c1.value.id, c2Id: c2.value.id };
```

## Expected outcomes

- Both clones appear inside `__handtest_target`.
- `c2` produces a warning of the form `no index provided for auto-layout`.
- The text on the clones updated by `setTextPreservingBindings` shows the
  new content, with the original font, text style, and any overrides
  preserved (visible by inspecting the layer's properties panel).
- Mixed-font text updates may produce a warning from `loadFontsForTextNode`;
  if they do, inspect the layer visually for styled-range drift.
- The `applyStyleProfile` round-trip produces no warnings if the source's
  bindings were valid.
- The screenshot of `__handtest_target` shows two cloned frames stacked
  vertically (or horizontally, depending on the parent's layout mode).

## Failure triage

If the screenshot shows the wrong outcome, start from
`skills/figma-writing/references/pitfalls.md`, then read the focused pitfall
file for the likely issue in this order:

1. Fonts (was the font loadable, and were mixed-font segments loaded?)
2. Design-system bindings (did the style snapshot survive the mutation?)
3. Sibling instances (was the pairing correct?)
4. Auto-layout (was the insert position right?)
