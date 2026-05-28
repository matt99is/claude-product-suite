# figma-writing Skill v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship v1 of the `figma-writing` skill inside the `claude-product-suite` Claude plugin: skill router, helper library, pitfalls catalogue, two playbooks, and a learning-loop slash command.

**Architecture:** A Claude plugin with skills scoped to subdirectories. The `figma-writing` skill bundles a `SKILL.md` router, a JS helper preamble pasted into every `use_figma` write call, a structured pitfalls reference, and two playbooks. A plugin-level `/figma-learn` command captures new learnings. Unit tests use Node's built-in `node:test` runner with a minimal Figma plugin API mock. Helpers heavily dependent on async Figma calls are validated via a documented hand-test playbook against a real Figma file.

**Tech Stack:** JavaScript (no transpile), Node `node:test` (zero deps), Markdown for all skill/command content, Claude plugin manifest schema.

**Spec:** `docs/specs/2026-05-28-figma-writing-skill-design.md`

---

## File Structure

Files this plan creates, with single-responsibility per file:

```
claude-product-suite/
├── .claude-plugin/
│   └── plugin.json                                       # plugin manifest
├── skills/figma-writing/
│   ├── SKILL.md                                          # router + guard
│   ├── helpers/
│   │   └── figma-helpers.js                              # 8 functions, pasted as preamble
│   ├── references/
│   │   └── pitfalls.md                                   # categorised gotchas
│   └── playbooks/
│       ├── clone-frame-with-text-updates.md              # recipe for clone+text
│       └── generate-variants-from-source.md              # recipe for N variants
├── commands/
│   └── figma-learn.md                                    # slash command
├── tests/
│   ├── figma-mocks.js                                    # minimal Figma plugin API mock
│   ├── helpers.match-text-nodes.test.js                  # unit tests
│   └── helpers.insert-child-safe.test.js                 # unit tests
├── package.json                                          # `npm test` only, no deps
└── README.md                                             # updated with v1 status
```

Test-related files cluster under `tests/`. Helpers and skill content cluster under `skills/figma-writing/`. Commands at plugin root by Claude convention.

---

## Task 1: Plugin scaffold

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `skills/figma-writing/.gitkeep`
- Create: `commands/.gitkeep`

- [ ] **Step 1: Create the plugin manifest**

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "claude-product-suite",
  "description": "Claude plugin bundling skills for product, design, and creative workflows. First skill: figma-writing.",
  "version": "0.1.0",
  "author": {
    "name": "Matthew Lelonek"
  },
  "repository": "https://github.com/matt99is/claude-product-suite",
  "license": "MIT",
  "keywords": [
    "figma",
    "design",
    "product",
    "creative"
  ]
}
```

- [ ] **Step 2: Create skill and command directory placeholders**

```bash
mkdir -p skills/figma-writing/helpers skills/figma-writing/references skills/figma-writing/playbooks commands
touch skills/figma-writing/.gitkeep commands/.gitkeep
```

- [ ] **Step 3: Verify manifest parses as valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json'))" && echo "VALID"`
Expected output: `VALID`

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/plugin.json skills/figma-writing/.gitkeep commands/.gitkeep
git commit -m "feat: add plugin manifest and skill scaffold"
```

---

## Task 2: SKILL.md

**Files:**
- Create: `skills/figma-writing/SKILL.md`
- Delete: `skills/figma-writing/.gitkeep` (no longer needed)

- [ ] **Step 1: Write SKILL.md**

Create `skills/figma-writing/SKILL.md`:

````markdown
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
````

- [ ] **Step 2: Verify SKILL.md has the required frontmatter fields**

Run:
```bash
head -5 skills/figma-writing/SKILL.md | grep -E "^(name|description):" | wc -l
```
Expected output: `2`

- [ ] **Step 3: Remove the placeholder gitkeep**

```bash
rm skills/figma-writing/.gitkeep
```

- [ ] **Step 4: Commit**

```bash
git add skills/figma-writing/SKILL.md
git rm skills/figma-writing/.gitkeep 2>/dev/null || true
git commit -m "feat: add figma-writing skill router (SKILL.md)"
```

---

## Task 3: Test scaffold (package.json + Figma mock)

**Files:**
- Create: `package.json`
- Create: `tests/figma-mocks.js`
- Create: `tests/smoke.test.js`

- [ ] **Step 1: Create package.json**

Create `package.json`:

```json
{
  "name": "claude-product-suite",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/",
    "check": "node --check skills/figma-writing/helpers/figma-helpers.js"
  }
}
```

- [ ] **Step 2: Create a minimal Figma mock**

Create `tests/figma-mocks.js`:

```js
// Minimal mock of the Figma plugin API surface used by unit-testable helpers.
// Heavy-API helpers (loadFontForNode, applyStyleProfile, setTextPreservingBindings,
// cloneAndRebind) are validated via hand-test in real Figma, not here.

export class MockNode {
  constructor({ id, type, name = '', children = [] } = {}) {
    this.id = id || `id-${Math.random().toString(36).slice(2)}`;
    this.type = type || 'FRAME';
    this.name = name;
    this.children = children;
    this.parent = null;
    for (const c of children) c.parent = this;
  }
}

export class MockTextNode extends MockNode {
  constructor(opts = {}) {
    super({ ...opts, type: 'TEXT' });
    this.characters = opts.characters || '';
    this.fontName = opts.fontName || { family: 'Inter', style: 'Regular' };
  }
}

export class MockAutoLayoutFrame extends MockNode {
  constructor(opts = {}) {
    super({ ...opts, type: 'FRAME' });
    this.layoutMode = opts.layoutMode || 'VERTICAL';
    this._inserts = [];
  }
  insertChild(index, node) {
    this._inserts.push({ index, nodeId: node.id });
    this.children.splice(index, 0, node);
    node.parent = this;
  }
  appendChild(node) {
    this._inserts.push({ index: 'append', nodeId: node.id });
    this.children.push(node);
    node.parent = this;
  }
}

export class MockStaticFrame extends MockNode {
  constructor(opts = {}) {
    super({ ...opts, type: 'FRAME' });
    this.layoutMode = 'NONE';
    this._inserts = [];
  }
  insertChild(index, node) {
    this._inserts.push({ index, nodeId: node.id });
    this.children.splice(index, 0, node);
    node.parent = this;
  }
  appendChild(node) {
    this._inserts.push({ index: 'append', nodeId: node.id });
    this.children.push(node);
    node.parent = this;
  }
}
```

- [ ] **Step 3: Write a smoke test to confirm the runner works**

Create `tests/smoke.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MockTextNode } from './figma-mocks.js';

test('smoke: mocks instantiate', () => {
  const n = new MockTextNode({ characters: 'hi' });
  assert.equal(n.type, 'TEXT');
  assert.equal(n.characters, 'hi');
});
```

- [ ] **Step 4: Run the smoke test, expect pass**

Run: `npm test`
Expected: `# pass 1` (or equivalent, no failures)

- [ ] **Step 5: Commit**

```bash
git add package.json tests/figma-mocks.js tests/smoke.test.js
git commit -m "test: scaffold node:test runner and minimal Figma mocks"
```

---

## Task 4: helpers — `getTextStyleIdCompat` and `loadFontForNode`

**Files:**
- Create: `skills/figma-writing/helpers/figma-helpers.js`

These two helpers are heavily dependent on the async Figma API. They are not unit-tested in v1. Syntax-checked here, hand-tested in real Figma later.

- [ ] **Step 1: Create helpers file with the first two functions**

Create `skills/figma-writing/helpers/figma-helpers.js`:

```js
// figma-helpers v1
// Paste the entire contents of this file as the preamble of every write-side
// use_figma script. Functions below are documented at call sites.

/**
 * Read a text node's textStyleId regardless of API version.
 * Newer files expose `getTextStyleIdAsync()`. Older files expose the sync
 * `textStyleId` property. Returns the id (string) or `''` if unstyled.
 */
async function getTextStyleIdCompat(node) {
  if (typeof node.getTextStyleIdAsync === 'function') {
    return await node.getTextStyleIdAsync();
  }
  return node.textStyleId || '';
}

/**
 * Load the font currently set on a text node. Returns `{ font, fallback, warnings }`.
 * Throws if the node's fontName is `figma.mixed` (the caller must handle mixed-font
 * text explicitly). Never silently swaps to a different family.
 */
async function loadFontForNode(node) {
  if (!node.fontName) {
    throw new Error(`loadFontForNode: node ${node.id} has no fontName`);
  }
  if (node.fontName === figma.mixed) {
    throw new Error(
      `loadFontForNode: node ${node.id} has mixed fonts; load each span explicitly`
    );
  }
  const font = node.fontName;
  await figma.loadFontAsync(font);
  return { font, fallback: false, warnings: [] };
}
```

- [ ] **Step 2: Syntax-check the file**

Run: `npm run check`
Expected: no output (exit code 0 indicates valid syntax)

- [ ] **Step 3: Commit**

```bash
git add skills/figma-writing/helpers/figma-helpers.js
git commit -m "feat(helpers): add getTextStyleIdCompat and loadFontForNode"
```

---

## Task 5: helpers — `snapshotStyleProfile` and `applyStyleProfile`

**Files:**
- Modify: `skills/figma-writing/helpers/figma-helpers.js`

These are heavily Figma-API-bound and validated by hand-test later, not unit-tested.

- [ ] **Step 1: Append the two style-profile helpers to the helpers file**

Append to `skills/figma-writing/helpers/figma-helpers.js`:

```js

/**
 * Capture a text node's full style profile: design-system links and the local
 * overrides that get reset when a text style is re-applied. Use with
 * applyStyleProfile to restore the profile after a destructive mutation.
 */
async function snapshotStyleProfile(node) {
  return {
    textStyleId: await getTextStyleIdCompat(node),
    fillStyleId: node.fillStyleId || '',
    boundVariables: { ...(node.boundVariables || {}) },
    overrides: {
      textDecoration: node.textDecoration,
      textCase: node.textCase,
      lineHeight: node.lineHeight,
      letterSpacing: node.letterSpacing,
    },
  };
}

/**
 * Re-apply a previously-captured style profile to a text node. Order matters:
 * the text style is applied first (which resets overrides to the style's
 * defaults), then variables are re-bound, then local overrides are re-applied
 * so they take precedence again.
 *
 * Returns `{ ok, warnings }`. Soft issues (missing variable, set failure)
 * become warnings rather than throwing.
 */
async function applyStyleProfile(node, profile) {
  const warnings = [];

  if (profile.textStyleId) {
    if (typeof node.setTextStyleIdAsync === 'function') {
      await node.setTextStyleIdAsync(profile.textStyleId);
    } else {
      node.textStyleId = profile.textStyleId;
    }
  }

  if (profile.fillStyleId) {
    node.fillStyleId = profile.fillStyleId;
  }

  for (const [prop, alias] of Object.entries(profile.boundVariables || {})) {
    try {
      const variable = await figma.variables.getVariableByIdAsync(alias.id);
      if (variable) {
        node.setBoundVariable(prop, variable);
      } else {
        warnings.push(`applyStyleProfile: variable ${alias.id} for ${prop} not found`);
      }
    } catch (e) {
      warnings.push(`applyStyleProfile: rebind ${prop} failed: ${e.message}`);
    }
  }

  for (const [prop, value] of Object.entries(profile.overrides || {})) {
    if (value === undefined) continue;
    try {
      node[prop] = value;
    } catch (e) {
      warnings.push(`applyStyleProfile: set ${prop} failed: ${e.message}`);
    }
  }

  return { ok: true, warnings };
}
```

- [ ] **Step 2: Syntax-check**

Run: `npm run check`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add skills/figma-writing/helpers/figma-helpers.js
git commit -m "feat(helpers): add snapshotStyleProfile and applyStyleProfile"
```

---

## Task 6: helpers — `setTextPreservingBindings`

**Files:**
- Modify: `skills/figma-writing/helpers/figma-helpers.js`

Composes snapshot, font load, set characters, re-apply snapshot. Hand-tested in real Figma.

- [ ] **Step 1: Append the helper**

Append to `skills/figma-writing/helpers/figma-helpers.js`:

```js

/**
 * Change a text node's characters while preserving its design-system bindings
 * and local overrides. Steps in order:
 *   1. Snapshot the style profile.
 *   2. Load the current font (required before assigning characters).
 *   3. Set characters.
 *   4. Re-apply the snapshot.
 *
 * Does not touch textAutoResize. Returns `{ ok, warnings }`.
 */
async function setTextPreservingBindings(node, newText) {
  if (node.type !== 'TEXT') {
    throw new Error(`setTextPreservingBindings: node ${node.id} is ${node.type}, expected TEXT`);
  }
  const warnings = [];
  const profile = await snapshotStyleProfile(node);
  const fontResult = await loadFontForNode(node);
  warnings.push(...fontResult.warnings);
  node.characters = newText;
  const applyResult = await applyStyleProfile(node, profile);
  warnings.push(...applyResult.warnings);
  return { ok: true, warnings };
}
```

- [ ] **Step 2: Syntax-check**

Run: `npm run check`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add skills/figma-writing/helpers/figma-helpers.js
git commit -m "feat(helpers): add setTextPreservingBindings"
```

---

## Task 7: helpers — `insertChildSafe` (with unit tests)

**Files:**
- Modify: `skills/figma-writing/helpers/figma-helpers.js`
- Create: `tests/helpers.insert-child-safe.test.js`

This helper is mostly logic over parent layout state. Unit-testable with the mock.

- [ ] **Step 1: Write the failing tests**

Create `tests/helpers.insert-child-safe.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MockAutoLayoutFrame, MockStaticFrame, MockNode } from './figma-mocks.js';

// Helpers are not modular ES exports (they are pasted as a preamble in use_figma).
// To unit-test, we wrap the helper source into a Function constructor and pull
// the desired function reference out. This avoids restructuring the production
// file purely for tests.
import { readFileSync } from 'node:fs';
const src = readFileSync(
  new URL('../skills/figma-writing/helpers/figma-helpers.js', import.meta.url),
  'utf8'
);
const harness = new Function(`${src}\nreturn { insertChildSafe };`);
const { insertChildSafe } = harness();

test('insertChildSafe: explicit index inserts at that position on auto-layout', () => {
  const parent = new MockAutoLayoutFrame();
  const a = new MockNode({ name: 'a' });
  const b = new MockNode({ name: 'b' });
  insertChildSafe(parent, 0, a);
  insertChildSafe(parent, 1, b);
  assert.deepEqual(parent.children.map(c => c.name), ['a', 'b']);
  assert.deepEqual(parent._inserts.map(i => i.index), [0, 1]);
});

test('insertChildSafe: omitted index on auto-layout falls back to end with a warning', () => {
  const parent = new MockAutoLayoutFrame();
  const a = new MockNode({ name: 'a' });
  const result = insertChildSafe(parent, undefined, a);
  assert.equal(result.ok, true);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /no index provided for auto-layout/);
  assert.equal(parent.children[0].name, 'a');
});

test('insertChildSafe: omitted index on static frame uses appendChild silently', () => {
  const parent = new MockStaticFrame();
  const a = new MockNode({ name: 'a' });
  const result = insertChildSafe(parent, undefined, a);
  assert.equal(result.ok, true);
  assert.equal(result.warnings.length, 0);
  assert.equal(parent._inserts[0].index, 'append');
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `npm test`
Expected: smoke test passes, the three insert-child-safe tests fail (because the helper is not yet defined).

- [ ] **Step 3: Append the helper to make the tests pass**

Append to `skills/figma-writing/helpers/figma-helpers.js`:

```js

/**
 * Insert a node into a parent at a specific index. If `index` is omitted and
 * the parent is auto-layout, falls back to end-of-flow with a warning instead
 * of silently using appendChild (which can hide positional bugs). If the
 * parent is not auto-layout, appendChild is used silently.
 *
 * Returns `{ ok, warnings }`.
 */
function insertChildSafe(parent, index, node) {
  const warnings = [];
  const isAutoLayout = parent.layoutMode && parent.layoutMode !== 'NONE';

  if (typeof index === 'number') {
    parent.insertChild(index, node);
  } else if (isAutoLayout) {
    parent.insertChild(parent.children.length, node);
    warnings.push(
      `insertChildSafe: no index provided for auto-layout parent ${parent.id}, appended at end`
    );
  } else {
    parent.appendChild(node);
  }

  return { ok: true, warnings };
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `npm test`
Expected: all four tests (1 smoke + 3 insert-child-safe) pass.

- [ ] **Step 5: Commit**

```bash
git add skills/figma-writing/helpers/figma-helpers.js tests/helpers.insert-child-safe.test.js
git commit -m "feat(helpers): add insertChildSafe with auto-layout fallback warning"
```

---

## Task 8: helpers — `matchTextNodesByIndex` (with unit tests)

**Files:**
- Modify: `skills/figma-writing/helpers/figma-helpers.js`
- Create: `tests/helpers.match-text-nodes.test.js`

Pure data structure logic. Fully unit-testable.

- [ ] **Step 1: Write the failing tests**

Create `tests/helpers.match-text-nodes.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MockNode, MockTextNode } from './figma-mocks.js';
import { readFileSync } from 'node:fs';

const src = readFileSync(
  new URL('../skills/figma-writing/helpers/figma-helpers.js', import.meta.url),
  'utf8'
);
const harness = new Function(`${src}\nreturn { matchTextNodesByIndex };`);
const { matchTextNodesByIndex } = harness();

function makeButton(label) {
  return new MockNode({
    name: `Button-${label}`,
    children: [new MockTextNode({ characters: label })],
  });
}

test('matchTextNodesByIndex: pairs text nodes by pre-order traversal', () => {
  const sourceA = makeButton('Save');
  const sourceB = makeButton('Cancel');
  const targetA = makeButton('Save'); // structurally identical clone
  const targetB = makeButton('Cancel');
  const sourceFrame = new MockNode({ children: [sourceA, sourceB] });
  const targetFrame = new MockNode({ children: [targetA, targetB] });

  const pairs = matchTextNodesByIndex(sourceFrame, targetFrame);
  assert.equal(pairs.length, 2);
  assert.equal(pairs[0][0].characters, 'Save');
  assert.equal(pairs[0][1], targetA.children[0]);
  assert.equal(pairs[1][0].characters, 'Cancel');
  assert.equal(pairs[1][1], targetB.children[0]);
});

test('matchTextNodesByIndex: throws on structural drift (different text counts)', () => {
  const source = new MockNode({ children: [new MockTextNode(), new MockTextNode()] });
  const target = new MockNode({ children: [new MockTextNode()] });
  assert.throws(() => matchTextNodesByIndex(source, target), /count mismatch/);
});

test('matchTextNodesByIndex: returns empty array when no text nodes', () => {
  const source = new MockNode({ children: [new MockNode({ name: 'x' })] });
  const target = new MockNode({ children: [new MockNode({ name: 'x' })] });
  const pairs = matchTextNodesByIndex(source, target);
  assert.deepEqual(pairs, []);
});

test('matchTextNodesByIndex: nested text nodes are matched in pre-order', () => {
  const sourceNested = new MockNode({
    children: [
      new MockNode({ children: [new MockTextNode({ characters: 'inner' })] }),
      new MockTextNode({ characters: 'outer' }),
    ],
  });
  const targetNested = new MockNode({
    children: [
      new MockNode({ children: [new MockTextNode({ characters: 'inner' })] }),
      new MockTextNode({ characters: 'outer' }),
    ],
  });
  const pairs = matchTextNodesByIndex(sourceNested, targetNested);
  assert.equal(pairs[0][0].characters, 'inner');
  assert.equal(pairs[1][0].characters, 'outer');
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `npm test`
Expected: existing tests still pass, the four match-text-nodes tests fail (helper not yet defined).

- [ ] **Step 3: Append the helper**

Append to `skills/figma-writing/helpers/figma-helpers.js`:

```js

/**
 * Pair the text nodes inside `sourceParent` with the text nodes inside
 * `targetParent` by pre-order traversal index. Use this instead of matching by
 * ancestor pathKey, which collapses sibling instances that share component
 * paths (e.g. two buttons in one frame whose internal text nodes have the
 * same path within their respective instances).
 *
 * Throws if the text node counts differ (structural drift suggests the clone
 * is not equivalent to the source and index-based matching is unsafe).
 */
function matchTextNodesByIndex(sourceParent, targetParent) {
  const collect = (root) => {
    const out = [];
    const walk = (n) => {
      if (n.type === 'TEXT') out.push(n);
      if (Array.isArray(n.children)) {
        for (const c of n.children) walk(c);
      }
    };
    walk(root);
    return out;
  };

  const sourceTexts = collect(sourceParent);
  const targetTexts = collect(targetParent);

  if (sourceTexts.length !== targetTexts.length) {
    throw new Error(
      `matchTextNodesByIndex: text node count mismatch ` +
      `(source=${sourceTexts.length}, target=${targetTexts.length})`
    );
  }

  return sourceTexts.map((s, i) => [s, targetTexts[i]]);
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `npm test`
Expected: all tests pass (1 smoke + 3 insert + 4 match).

- [ ] **Step 5: Commit**

```bash
git add skills/figma-writing/helpers/figma-helpers.js tests/helpers.match-text-nodes.test.js
git commit -m "feat(helpers): add matchTextNodesByIndex with structural-drift guard"
```

---

## Task 9: helpers — `cloneAndRebind`

**Files:**
- Modify: `skills/figma-writing/helpers/figma-helpers.js`

Heavily API-bound (uses `source.clone()`, async style getters). Validated by hand-test.

- [ ] **Step 1: Append the helper**

Append to `skills/figma-writing/helpers/figma-helpers.js`:

```js

/**
 * Clone a node, insert it into `parent` at `insertIndex` via
 * insertChildSafe, then verify the clone's text-node bindings did not drift
 * from the source. If they did, re-apply the source's textStyleId.
 *
 * Returns `{ ok, warnings, value }` where `value` is the inserted clone.
 */
async function cloneAndRebind(source, parent, insertIndex) {
  const warnings = [];

  const clone = source.clone();

  const insertResult = insertChildSafe(parent, insertIndex, clone);
  warnings.push(...insertResult.warnings);

  const collectTexts = (root) => {
    const out = [];
    const walk = (n) => {
      if (n.type === 'TEXT') out.push(n);
      if (Array.isArray(n.children)) {
        for (const c of n.children) walk(c);
      }
    };
    walk(root);
    return out;
  };

  const sourceTexts = collectTexts(source);
  const cloneTexts = collectTexts(clone);

  if (sourceTexts.length !== cloneTexts.length) {
    warnings.push(
      `cloneAndRebind: structural drift, source has ${sourceTexts.length} text nodes, ` +
      `clone has ${cloneTexts.length}`
    );
    return { ok: true, warnings, value: clone };
  }

  for (let i = 0; i < sourceTexts.length; i++) {
    const srcId = await getTextStyleIdCompat(sourceTexts[i]);
    const cloneId = await getTextStyleIdCompat(cloneTexts[i]);
    if (srcId && srcId !== cloneId) {
      warnings.push(`cloneAndRebind: textStyleId drifted on text node ${i}, re-applying`);
      if (typeof cloneTexts[i].setTextStyleIdAsync === 'function') {
        await cloneTexts[i].setTextStyleIdAsync(srcId);
      } else {
        cloneTexts[i].textStyleId = srcId;
      }
    }
  }

  return { ok: true, warnings, value: clone };
}
```

- [ ] **Step 2: Syntax-check and re-run existing tests**

Run: `npm run check && npm test`
Expected: no syntax errors, existing 8 tests still pass.

- [ ] **Step 3: Commit**

```bash
git add skills/figma-writing/helpers/figma-helpers.js
git commit -m "feat(helpers): add cloneAndRebind with text-style drift check"
```

---

## Task 10: pitfalls.md

**Files:**
- Create: `skills/figma-writing/references/pitfalls.md`

- [ ] **Step 1: Write the pitfalls catalogue**

Create `skills/figma-writing/references/pitfalls.md`:

````markdown
# Figma writing pitfalls

A catalogue of write-side traps encountered in real Figma plugin work. The
`figma-writing` skill points here pre-flight. Add new entries via
`/figma-learn`.

Each entry uses the same four-part format: **Symptom**, **Cause**,
**Correct pattern**, **When this matters**.

---

## Fonts

### Custom font not available in the cloud renderer

#### Symptom
`setCharacters` throws "font is not loaded", or text falls back to Inter with
a different metric (kerning, x-height, line height drift).

#### Cause
The font is installed on the designer's local machine, but the `use_figma`
MCP runs against Figma's cloud renderer. Only fonts uploaded to the org's
shared font library are loadable in the cloud.

#### Correct pattern
Call `figma.listAvailableFontsAsync()` before assuming a font is loadable.
If the family is missing, surface that to the user and stop. Never
force-swap to Inter as a fallback inside a styled brand layout.

#### When this matters
Any text mutation. Especially first-time scripts against an unfamiliar file.

### Style-name mismatch between foundries

#### Symptom
`loadFontAsync({ family: "TT Commons Pro", style: "Semi Bold" })` throws
"style not found".

#### Cause
Foundries name weights inconsistently: `Semi Bold`, `SemiBold`, `DemiBold`,
`Demibold`. Assuming a style name based on intuition fails.

#### Correct pattern
Read the node's actual `fontName` and pass it to `loadFontForNode`. Do not
construct font objects from intent.

#### When this matters
Any text mutation on bound styles where you have not first inspected the
node's current font.

---

## Design-system bindings

### Mutating a property under a bound style breaks the binding

#### Symptom
The layer's fill goes back to the style's default on the next library update,
or the text decoration is wrong after rebinding the text style.

#### Cause
Setting `node.fontName`, `node.fontSize`, `node.fills`, `node.textDecoration`,
etc. on a node that had a `textStyleId` or `fillStyleId` detaches the
property's link. Even rebinding the style later does not restore the original
local override values: the style's defaults take over.

#### Correct pattern
Use `setTextPreservingBindings(node, text)`. It snapshots the profile, loads
the font, sets characters, then re-applies the snapshot (style first, then
overrides). For non-text mutations, snapshot manually with
`snapshotStyleProfile` and `applyStyleProfile`.

#### When this matters
Any text mutation. Any clone whose properties are subsequently changed.

### Bound variables are lost across mutations

#### Symptom
A token-bound colour or size reverts to the literal value after a script run.

#### Cause
`node.boundVariables` is read-only. Mutating the underlying property unbinds
it. Re-binding requires `node.setBoundVariable(prop, variable)` per property.

#### Correct pattern
Capture `boundVariables` in `snapshotStyleProfile`. Re-apply via
`applyStyleProfile`, which iterates and calls `setBoundVariable` per entry.

#### When this matters
Any file using design tokens. Cloning, text-style swaps, fill-style swaps.

---

## Sibling instances with identical paths

### Path-keyed matching collapses sibling instances

#### Symptom
You clone a frame containing two button instances and update text in both.
After running, only one button shows the update; the other has been
overwritten or skipped.

#### Cause
Both buttons have a text node at the same ancestor path inside their
instance (e.g. `instance/buttonText`). Keying by pathKey collapses both
paths to one key, so the second sibling either overwrites the first or is
silently dropped.

#### Correct pattern
Use `matchTextNodesByIndex(sourceParent, targetParent)`. It walks both
parents in pre-order and pairs text nodes by traversal index. It throws if
text node counts differ, which catches structural drift.

#### When this matters
Any clone of a frame that contains repeated component instances.

---

## Auto-layout

### `appendChild` ignores intended position

#### Symptom
A cloned node ends up at the bottom of an auto-layout frame regardless of
the `x` / `y` you set on it.

#### Cause
`parent.appendChild(node)` places the node at the end of the visual flow in
auto-layout, ignoring positioning hints entirely.

#### Correct pattern
Use `insertChildSafe(parent, index, node)`. It uses `insertChild(index, node)`
when an explicit index is provided, and warns (rather than silently appending)
when the parent is auto-layout and no index is given.

#### When this matters
Any clone or new-node creation inside an auto-layout container.

### Parent re-sizes unexpectedly after a text change

#### Symptom
A fixed-height frame containing text grows or shrinks. Adjacent siblings
get pushed out of position.

#### Cause
Auto-layout parents resize to fit their content when their text children
re-wrap. A text mutation that adds or removes characters can trigger a wrap
change.

#### Correct pattern
After mutating text inside an auto-layout container, screenshot the parent
frame (not just the changed node). Inspect for re-flow. If the parent is
fixed-height and the content overflows, surface that to the user.

#### When this matters
Any text mutation inside an auto-layout container.

---

## Text wrapping

### Forcing `textAutoResize` breaks expanding buttons

#### Symptom
A button's text wraps to multiple ugly lines after a script run, even though
the new text is shorter than the old.

#### Cause
Buttons in design systems often set `textAutoResize: 'WIDTH_AND_HEIGHT'`
so the text node expands inline with the button width. A blanket helper that
forces `textAutoResize: 'HEIGHT'` locks the node to whatever width it had
(often a tiny default like 54px) and forces multi-line wrapping.

#### Correct pattern
Never change `textAutoResize` as a default. If a script needs to, state the
reason out loud and document it on the script.

#### When this matters
Any text mutation inside a design-system button or chip component.

---

## Progress arcs

### Arc starts at the wrong angle or goes the wrong direction

#### Symptom
A progress ring intended to start at 12 o'clock and fill clockwise starts at
3 o'clock or fills counter-clockwise.

#### Cause
Figma's arc convention is non-standard: angle `0` is at the top (12 o'clock)
and positive radians go clockwise. Standard math convention has `0` at the
right (3 o'clock) and positive radians going counter-clockwise.

#### Correct pattern
For a clockwise progress ring filling from the top:
`ellipse.arcData = { startingAngle: 0, endingAngle: (percent/100) * 2 * Math.PI, innerRadius }`.
Preserve `innerRadius` to keep the donut shape.

#### When this matters
Any ellipse with `arcData` (progress rings, gauges, pie segments).

---

## API quirks

### Some getters are async on newer files, sync on older ones

#### Symptom
`node.textStyleId` returns `undefined` or a Promise object instead of the id.

#### Cause
Newer Figma files expose `getTextStyleIdAsync()` as the canonical reader.
Older files still expose the sync `textStyleId` property. The presence of
the async method indicates which.

#### Correct pattern
Use `getTextStyleIdCompat(node)`. It checks for the async method first and
falls back to the sync property.

#### When this matters
Any read of style ids across mixed-age files.

### Setting `figma.currentPage` directly is unsupported

#### Symptom
A page-switch operation does nothing, or throws "currentPage is read-only".

#### Cause
`figma.currentPage = page` is not a supported assignment.

#### Correct pattern
`await figma.setCurrentPageAsync(page)`.

#### When this matters
Any script that navigates between pages before mutating.

---

## Verification

### The plugin API report claims success but the render is wrong

#### Symptom
The `use_figma` response says the operation succeeded, but the screenshot
shows a misaligned, overflowing, or unstyled result.

#### Cause
The API confirms the mutation ran, not that the visual outcome matches the
intent. Re-flows, font fallbacks, and binding losses all produce successful
API responses with wrong rendered output.

#### Correct pattern
Screenshot after the final mutation in a sequence via the read-side
`get_screenshot` MCP tool. Compare against the operation's intent. If
diverged, screenshot intermediate states to localise the failure.

#### When this matters
Every visual mutation. Especially after text changes inside auto-layout
parents.
````

- [ ] **Step 2: Verify section count and basic structure**

Run:
```bash
grep -c "^## " skills/figma-writing/references/pitfalls.md
grep -c "^### " skills/figma-writing/references/pitfalls.md
```
Expected first count: `8` (eight top-level categories).
Expected second count: at least `12` (entries within categories).

- [ ] **Step 3: Commit**

```bash
git add skills/figma-writing/references/pitfalls.md
git commit -m "docs(skill): seed pitfalls.md from original brief (8 categories)"
```

---

## Task 11: Playbooks (both)

**Files:**
- Create: `skills/figma-writing/playbooks/clone-frame-with-text-updates.md`
- Create: `skills/figma-writing/playbooks/generate-variants-from-source.md`

- [ ] **Step 1: Write the clone-and-update playbook**

Create `skills/figma-writing/playbooks/clone-frame-with-text-updates.md`:

````markdown
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
````

- [ ] **Step 2: Write the variants playbook**

Create `skills/figma-writing/playbooks/generate-variants-from-source.md`:

````markdown
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
````

- [ ] **Step 3: Verify both files exist and have the required sections**

Run:
```bash
for f in skills/figma-writing/playbooks/clone-frame-with-text-updates.md skills/figma-writing/playbooks/generate-variants-from-source.md; do
  echo "== $f =="
  grep -E "^## (When to use|What Claude needs first|Pre-flight reads|Steps|Common failures)" "$f"
done
```
Expected: each file lists all five section headings.

- [ ] **Step 4: Commit**

```bash
git add skills/figma-writing/playbooks/
git commit -m "docs(skill): add clone-and-update and variants playbooks"
```

---

## Task 12: `/figma-learn` slash command

**Files:**
- Create: `commands/figma-learn.md`

- [ ] **Step 1: Write the slash command**

Create `commands/figma-learn.md`:

````markdown
---
description: "Capture a new Figma writing learning as a structured pitfall, playbook step, or helper TODO. Commits it."
---

You are capturing a new learning about Figma writing that emerged during this
session. The goal is to make sure it survives the conversation as a
structured, committed entry in the `figma-writing` skill.

Follow these five steps in order.

## 1. Identify the learning

If the user supplied a description as command args, use it. Otherwise ask:

> "What did you learn? Phrase it as a symptom (what looked wrong) or a rule
> (what to do instead). One or two sentences is enough."

Wait for an answer before continuing.

## 2. Classify the learning

Decide which of these four categories it belongs to. If unsure, propose the
most likely category and ask the user to confirm or correct.

- **New pitfall.** A trap not currently covered in `references/pitfalls.md`.
  This is the most common case.
- **Refinement of an existing pitfall.** An entry already exists but the
  symptom, cause, correct pattern, or applicability needs updating.
- **New playbook step or new playbook.** A step is missing from an existing
  playbook, or a whole new operation should be documented.
- **Helper TODO.** The learning suggests a code change to
  `helpers/figma-helpers.js` rather than documentation. Do not auto-edit
  helper code. Capture the change as a TODO note inside the pitfall entry.

## 3. Draft the entry

For a new pitfall, produce a draft in this exact format:

```markdown
### <Short title naming the trap>

#### Symptom
What looks wrong. What the user notices.

#### Cause
Why it happens. One or two sentences.

#### Correct pattern
What to do instead. Reference a helper if one exists, otherwise the manual
steps. If a helper TODO, write that here.

#### When this matters
Which operations this surfaces in.
```

For a refinement, show the existing entry and the proposed diff.

For a playbook change, draft the new step or playbook stub in the same
format as the existing playbooks under `skills/figma-writing/playbooks/`.

## 4. Show the draft to the user

Present the draft and ask:

> "Does this capture it? Edit the wording or tell me to change classification."

Iterate until the user approves.

## 5. Apply and commit

- For a new pitfall: append the entry under the appropriate category in
  `skills/figma-writing/references/pitfalls.md`. If a new category is
  needed, create it.
- For a refinement: edit the existing entry in place.
- For a playbook change: edit or create the relevant file under
  `skills/figma-writing/playbooks/`.
- For a helper TODO: record it as a pitfall entry whose Correct pattern
  reads `TODO(helper): <description>`. The next time helper code is
  changed, address the TODO in a real code change with tests.

Stage the changed files and commit with:

```bash
git add <changed-paths>
git commit -m "learn(figma): <one-line summary>"
```

End by showing the user the commit hash and a short summary of what was
added or changed.
````

- [ ] **Step 2: Verify frontmatter and section headings**

Run:
```bash
head -3 commands/figma-learn.md | grep -E "^(---|description:)" | wc -l
grep -E "^## [0-9]" commands/figma-learn.md | wc -l
```
Expected first count: `3` (opening `---`, description line, closing `---`).
Expected second count: `5` (the five numbered sections).

- [ ] **Step 3: Commit**

```bash
git add commands/figma-learn.md
git commit -m "feat(commands): add /figma-learn slash command"
```

---

## Task 13: README update and hand-test instructions

**Files:**
- Modify: `README.md`
- Create: `docs/hand-test-figma-helpers.md`

- [ ] **Step 1: Rewrite README to reflect v1 state**

Replace the existing `README.md` contents with:

```markdown
# claude-product-suite

A Claude plugin bundling skills for product, design, and creative workflows.

## Installed skills

- **`figma-writing`** (v1). Safe write-side operations against the Figma MCP.
  Covers cloning frames, updating text while preserving design-system
  bindings, generating variants, and auto-layout-aware insertion. Surfaces
  warnings rather than silently swapping fonts or breaking style links.

Planned future skills (not yet implemented): user research, slide-deck
building, prototyping, and others.

## Layout

```
claude-product-suite/
├── .claude-plugin/plugin.json
├── skills/figma-writing/
│   ├── SKILL.md
│   ├── helpers/figma-helpers.js
│   ├── references/pitfalls.md
│   └── playbooks/
├── commands/figma-learn.md
├── tests/
├── docs/
└── package.json
```

Each skill is self-contained inside its own folder. Helpers, references,
and playbooks are scoped to the skill that uses them. Commands live at the
plugin root by Claude plugin convention.

## Development

Tests use Node's built-in `node:test` runner. No external dependencies.

```bash
npm test          # run unit tests
npm run check     # syntax-check the helpers file
```

Unit tests cover the two helpers with pure-data logic
(`matchTextNodesByIndex`, `insertChildSafe`). The remaining six helpers are
hand-tested against a real Figma file using the instructions in
[`docs/hand-test-figma-helpers.md`](docs/hand-test-figma-helpers.md).

## Adding a new skill

Adding a sibling skill (e.g. `user-research`) is a clone-and-rename
operation against `skills/figma-writing/`. Each new skill includes:

- `SKILL.md` (router and guard)
- `references/pitfalls.md` (categorised gotchas in the same per-entry format)
- `playbooks/` (operation recipes)
- An optional `helpers/` folder if the skill has an execution surface
- A corresponding `/<skill-name>-learn` slash command at `commands/`

## Audience

Personal use, then shared with colleagues. Public distribution deferred.
```

- [ ] **Step 2: Write the hand-test instructions**

Create `docs/hand-test-figma-helpers.md`:

````markdown
# Hand-testing figma-helpers in real Figma

Six of the eight helpers in `skills/figma-writing/helpers/figma-helpers.js`
are not unit-tested because mocking the relevant Figma plugin API surface
would be more work than the value warrants for v1. They are validated by
running the script below against a real Figma file via the `use_figma` MCP
tool.

## Prerequisites

- A Figma file you can write to in the cloud renderer.
- The file contains at least one frame named `__handtest_source` containing:
  - One text node with a bound text style.
  - Optionally, a second text node and a non-text shape.
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
- The `applyStyleProfile` round-trip produces no warnings if the source's
  bindings were valid.
- The screenshot of `__handtest_target` shows two cloned frames stacked
  vertically (or horizontally, depending on the parent's layout mode).

## Failure triage

If the screenshot shows the wrong outcome, walk through pitfalls.md in
this order:

1. Fonts (was the font loadable?)
2. Design-system bindings (did the style snapshot survive the mutation?)
3. Sibling instances (was the pairing correct?)
4. Auto-layout (was the insert position right?)
````

- [ ] **Step 3: Verify the README and hand-test doc exist with their key sections**

Run:
```bash
test -f README.md && test -f docs/hand-test-figma-helpers.md && echo "BOTH PRESENT"
grep -E "^## (Installed skills|Layout|Development|Adding a new skill)" README.md | wc -l
grep -E "^## (Prerequisites|Test script|Expected outcomes|Failure triage)" docs/hand-test-figma-helpers.md | wc -l
```
Expected output: `BOTH PRESENT`, then `4`, then `4`.

- [ ] **Step 4: Commit**

```bash
git add README.md docs/hand-test-figma-helpers.md
git commit -m "docs: update README for v1 and add hand-test instructions"
```

---

## Task 14: Final verification and push

**Files:** none (verification only)

- [ ] **Step 1: Run all tests one final time**

Run: `npm test && npm run check`
Expected: all tests pass, syntax check has no output.

- [ ] **Step 2: Verify the v1 deliverables list**

Run:
```bash
test -f .claude-plugin/plugin.json && \
test -f skills/figma-writing/SKILL.md && \
test -f skills/figma-writing/helpers/figma-helpers.js && \
test -f skills/figma-writing/references/pitfalls.md && \
test -f skills/figma-writing/playbooks/clone-frame-with-text-updates.md && \
test -f skills/figma-writing/playbooks/generate-variants-from-source.md && \
test -f commands/figma-learn.md && \
test -f README.md && \
test -f docs/hand-test-figma-helpers.md && \
echo "V1 COMPLETE"
```
Expected output: `V1 COMPLETE`.

- [ ] **Step 3: Count helper functions to confirm all eight ship**

Run:
```bash
grep -E "^(async )?function [a-zA-Z]+" skills/figma-writing/helpers/figma-helpers.js | wc -l
```
Expected output: `8` (getTextStyleIdCompat, loadFontForNode, snapshotStyleProfile, applyStyleProfile, setTextPreservingBindings, insertChildSafe, matchTextNodesByIndex, cloneAndRebind).

- [ ] **Step 4: Push to GitHub**

Run:
```bash
git push origin main
```
Expected: push succeeds.

- [ ] **Step 5: (Optional) Run the hand-test against a real Figma file**

Follow `docs/hand-test-figma-helpers.md`. Surface any new pitfalls via
`/figma-learn`.

---

## Notes on what is deliberately out of v1

- `setProgressArc` helper. Lower frequency. Add via `/figma-learn` or a
  later task when first needed.
- `setCurrentPageSafe` helper. Trivial to inline when needed.
- A variant-generation helper function. The variants playbook composes
  existing helpers; no new code required.
- Unit tests for the six API-bound helpers. Hand-test instead.
- Tightened screenshot policy. Current policy is screenshot after the
  final mutation in a sequence. Revisit if drift is observed in practice.
- Any sibling skill (user-research, slide-decks, prototyping). Their
  folders are not created in v1.
