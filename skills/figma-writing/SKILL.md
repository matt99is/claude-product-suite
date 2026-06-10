---
name: figma-writing
description: Use when modifying, cloning, or generating Figma nodes via the MCP, covering cloning components, updating text while preserving design-system bindings, generating variants, and any use_figma call that mutates the file. Read this before writing JS for use_figma.
---

# figma-writing

This skill governs every write-side operation against Figma through write-capable Figma MCP tools such as `use_figma`. The Figma cloud renderer is the execution environment. The render is the truth, the API response is the intention.

Figma setup is part of the safety guard. A user may have read-only Figma context available without having write-to-canvas capability. Before attempting mutation, confirm the write-capable Figma MCP setup described in `references/setup-and-permissions.md`, including the Claude Code setup command `claude plugin install figma@claude-plugins-official` when guidance is needed, and confirm the authenticated user has edit access to the target file.

## Non-negotiables

1. Never attempt mutation unless a write-capable Figma MCP server is connected and the user has edit access to the target file. If unsure, read `references/setup-and-permissions.md` and provide setup guidance before writing.
2. Never set `node.characters` without first calling `loadFontForNode(node)`. Setting characters with an unloaded font throws.
3. Never mutate a styled property (fontName, fontSize, fills, textStyleId source) without re-applying the snapshot. Mutating a bound property breaks the binding silently.
4. Never use ancestor pathKeys to match text nodes across sibling instances. Use `matchTextNodesByIndex(sourceParent, targetParent)`.
5. Never trust the `use_figma` API response as confirmation. Screenshot to verify visual mutations.
6. Never change `textAutoResize`. If you think you need to, state the reason out loud and read the Text wrapping section of `references/pitfalls.md` first.

## Pre-flight checklist

Before writing any `use_figma` script:

1. Identify whether the user is asking for Figma mutation, read-only inspection, or critique. Route critique to `design-critique` instead.
2. Confirm a write-capable Figma MCP setup is available. If the server, tools, authentication, or file edit access are unclear, read `skills/figma-writing/references/setup-and-permissions.md` and stop to provide setup or troubleshooting guidance.
3. Identify the operation type: clone, text update, variant generation, process map or flow chart, arc, or other.
4. If a playbook in `skills/figma-writing/playbooks/` matches, read it end to end. For process maps, flow charts, journey maps, service blueprints, workflow diagrams, or stakeholder-level process views, use `playbooks/create-process-map-or-flowchart.md`.
5. Read the sections of `skills/figma-writing/references/pitfalls.md` named in the playbook (or the relevant categories if no playbook fits).
6. For text operations, confirm the font is loadable. If unsure, call `figma.listAvailableFontsAsync()` from a probe script first.

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

When a new failure mode surfaces (especially in auto-layout), invoke the `/figma-learn` slash command. It captures the learning as local learning by default so public users can build their own skillset. Maintainer improvements to this plugin are handled as normal project work with explicit approval, tests, and local commits. Conversation history is not a durable record.
