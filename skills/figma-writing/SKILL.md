---
name: figma-writing
description: Use when modifying, cloning, or generating Figma nodes via the MCP, covering cloning components, updating text while preserving design-system bindings, generating variants, and any use_figma call that mutates the file. Read this before writing JS for use_figma.
---

# figma-writing

This skill governs every write-side operation against Figma through write-capable Figma MCP tools such as `use_figma`. The Figma cloud renderer is the execution environment. The render is the truth, the API response is the intention.

Figma setup is part of the safety guard, but do not start with setup guidance when the current session already exposes write-capable Figma tools. If `use_figma` or an equivalent write tool is available and the user supplied a target file or selection URL, attempt the requested edit and verify it. If write tools are missing or the write attempt fails, read `references/setup-and-permissions.md` for surface-specific troubleshooting, including Claude Code CLI, Claude Desktop, Claude.ai web, Claude chat, and Claude Cowork. Only show the Claude Code CLI command `claude plugin install figma@claude-plugins-official` after troubleshooting confirms the user is in Claude Code CLI.

## Non-negotiables

1. Never attempt mutation unless a write-capable Figma tool is available in the current session, the user supplied a target file or selection URL, and the authenticated user has edit access to the target file. If tools are missing or a write fails, read `references/setup-and-permissions.md` and troubleshoot the user surface before giving setup advice.
2. Never set `node.characters` without first calling `loadFontForNode(node)`. Setting characters with an unloaded font throws.
3. Never mutate a styled property (fontName, fontSize, fills, textStyleId source) without re-applying the snapshot. Mutating a bound property breaks the binding silently.
4. Never use ancestor pathKeys to match text nodes across sibling instances. Use `matchTextNodesByIndex(sourceParent, targetParent)`.
5. Never trust the `use_figma` API response as confirmation. Screenshot to verify visual mutations.
6. Never change `textAutoResize`. If you think you need to, state the reason out loud and read the Text wrapping section of `references/pitfalls.md` first.
7. When the user supplies a target node or page URL, resolve that node with `figma.getNodeByIdAsync`, find its containing page, and create or place new work on that page or inside the requested target. Do not append new work to `figma.currentPage` unless no target node or page was supplied.
8. Matching fonts and colours is not design-system compliance. For design-system-safe work, verify styles or variable bindings on non-component nodes; copied resolved values are drift unless the user explicitly accepts them.

## Pre-flight checklist

Before writing any `use_figma` script:

1. Identify whether the user is asking for Figma mutation, read-only inspection, or critique. Route critique to `design-critique` instead.
2. Check whether write-capable Figma tools are available. If they are, attempt the requested edit; if they are missing or the write fails, read `skills/figma-writing/references/setup-and-permissions.md` and give surface-specific setup or troubleshooting guidance.
3. Resolve the target page before mutation. If the user supplied a node URL, use the node ID from the URL as the placement anchor, resolve it with `figma.getNodeByIdAsync`, find the containing page, and call `await figma.setCurrentPageAsync(page)`. Do not rely on `figma.currentPage` for placement when a target node or page URL exists.
4. Identify the operation type: clone, text update, variant generation, design-system-safe frame or component creation, table, chart, graph, style-matched node creation, process map or flow chart, arc, or other.
5. If a playbook in `skills/figma-writing/playbooks/` matches, read it end to end. For design-system-safe frames, components, tables, charts, graphs, dashboards, or production-looking UI, use `playbooks/build-with-design-system.md`. For process maps, flow charts, journey maps, service blueprints, workflow diagrams, or stakeholder-level process views, use `playbooks/create-process-map-or-flowchart.md`. For net-new nodes or artefacts that should match an existing Figma file style but do not need strict design-system reuse, use `playbooks/build-nodes-matching-existing-style.md`.
6. Read the sections of `skills/figma-writing/references/pitfalls.md` named in the playbook (or the relevant categories if no playbook fits). For design-system discovery, auto-layout sizing, existing table edits, charts, cross-file style matching, or concurrent editing, read those pitfall sections before scripting.
7. For text operations, confirm the font is loadable. If unsure, call `figma.listAvailableFontsAsync()` from a probe script first.

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

For auto-layout-affected mutations, screenshot the parent frame after the final mutation, not just the mutated node. When a target node or page URL was supplied, screenshot the frame on that resolved page so wrong-page placement is caught.

## Verification

1. After the final mutation in a sequence, take a screenshot via the Figma MCP read-side tools.
2. Compare against the operation's intent.
3. If the screenshot does not match, screenshot intermediate states to localise where it diverged. Do not iterate blindly. Read the relevant pitfall section first.

## Learning loop

When a new failure mode surfaces (especially in auto-layout), invoke the `/figma-learn` slash command. It captures the learning as local learning by default so public users can build their own skillset. Maintainer improvements to this plugin are handled as normal project work with explicit approval, tests, and local commits. Conversation history is not a durable record.
