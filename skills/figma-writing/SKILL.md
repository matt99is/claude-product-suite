---
name: figma-writing
description: Use when modifying, cloning, or generating Figma nodes via the MCP, covering cloning components, updating text while preserving design-system bindings, generating variants, and any use_figma call that mutates the file. Read this before writing JS for use_figma.
---

# figma-writing

This skill governs every write-side operation against Figma through the `use_figma` MCP tool. The Figma cloud renderer is the execution environment. The render is the truth, the API response is the intention.

## Non-negotiables

1. Never set `node.characters` without first calling `loadFontForNode(node)`. Setting characters with an unloaded font throws.
2. Never mutate a styled property (fontName, fontSize, fills, textStyleId source) without re-applying the snapshot. Mutating a bound property breaks the binding silently.
3. Never use ancestor pathKeys to match text nodes across sibling instances. Use `matchTextNodesByIndex(sourceParent, targetParent)`.
4. Never trust the `use_figma` API response as confirmation. Screenshot to verify visual mutations.
5. Never change `textAutoResize`. If you think you need to, state the reason out loud and read the Text wrapping section of `references/pitfalls.md` first.

## Pre-flight checklist

Before writing any `use_figma` script:

1. Identify the operation type: clone, text update, variant generation, arc, or other.
2. If a playbook in `skills/figma-writing/playbooks/` matches, read it end to end.
3. Read the sections of `skills/figma-writing/references/pitfalls.md` named in the playbook (or the relevant categories if no playbook fits).
4. For text operations, confirm the font is loadable. If unsure, call `figma.listAvailableFontsAsync()` from a probe script first.

## Script-writing pattern

Every write-side `use_figma` script has two parts:

1. **Preamble.** Paste the full contents of `skills/figma-writing/helpers/figma-helpers.js` at the top.
2. **Operation.** Five to twenty lines that call the helpers by name. Do not re-implement helper logic inline.

Skeleton:

```js
// === figma-helpers v1 preamble (paste contents of skills/figma-writing/helpers/figma-helpers.js here) ===

// === operation ===
const source = figma.currentPage.findOne(n => n.name === 'Button/Primary');
const parent = figma.currentPage.findOne(n => n.name === 'Variants');
const cloneResult = await cloneAndRebind(source, parent, 2);
const pairs = matchTextNodesByIndex(source, cloneResult.value);
const warnings = [...cloneResult.warnings];
for (const [src, tgt] of pairs) {
  const r = await setTextPreservingBindings(tgt, `Buy ${src.characters}`);
  warnings.push(...r.warnings);
}
return { ok: true, warnings, cloneId: cloneResult.value.id };
```

For auto-layout-affected mutations, screenshot the parent frame after the final mutation, not just the mutated node.

## Verification

1. After the final mutation in a sequence, take a screenshot via the Figma MCP read-side tools.
2. Compare against the operation's intent.
3. If the screenshot does not match, screenshot intermediate states to localise where it diverged. Do not iterate blindly. Read the relevant pitfall section first.

## Learning loop

When a new failure mode surfaces (especially in auto-layout), invoke the `/figma-learn` slash command. It captures the learning as a structured pitfall, playbook step, or helper TODO, then commits it. Conversation history is not a durable record.
