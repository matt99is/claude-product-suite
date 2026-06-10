// figma-helpers v1
// Paste the entire contents of this file as the preamble of every write-side
// use_figma script. Functions below are documented at call sites.

/**
 * Read a text node's textStyleId regardless of API version.
 * Newer files expose `getTextStyleIdAsync()`. Older files expose the sync
 * `textStyleId` property. Returns the id (string) or `''` if unstyled.
 */
async function getTextStyleIdCompat(node) {
  let asyncReader;
  try {
    asyncReader = node.getTextStyleIdAsync;
  } catch (e) {
    asyncReader = null;
  }

  if (typeof asyncReader === 'function') {
    try {
      return await asyncReader.call(node);
    } catch (e) {
      // Fall back to sync textStyleId below for older or proxy-backed files.
    }
  }

  try {
    return node.textStyleId || '';
  } catch (e) {
    return '';
  }
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

/**
 * Load every font needed before changing a text node characters. Single-font
 * nodes delegate to loadFontForNode. Mixed-font nodes load each styled segment
 * font and return a warning so callers know to visually verify styled ranges.
 */
async function loadFontsForTextNode(node) {
  if (node.type !== "TEXT") {
    throw new Error(`loadFontsForTextNode: node ${node.id} is ${node.type}, expected TEXT`);
  }
  if (!node.fontName) {
    throw new Error(`loadFontsForTextNode: node ${node.id} has no fontName`);
  }
  if (node.fontName !== figma.mixed) {
    const result = await loadFontForNode(node);
    return {
      ok: true,
      fonts: [result.font],
      fallback: result.fallback,
      warnings: result.warnings,
    };
  }

  if (typeof node.getStyledTextSegments !== "function") {
    throw new Error(
      `loadFontsForTextNode: node ${node.id} has mixed fonts but cannot list styled text segments`
    );
  }

  const fonts = [];
  const seen = new Set();
  const segments = node.getStyledTextSegments(["fontName"]);
  for (const segment of segments) {
    const font = segment.fontName;
    if (!font || font === figma.mixed) {
      throw new Error(
        `loadFontsForTextNode: node ${node.id} has a segment without a concrete fontName`
      );
    }
    const key = `${font.family}\u0000${font.style}`;
    if (seen.has(key)) continue;
    seen.add(key);
    fonts.push(font);
  }

  for (const font of fonts) {
    await figma.loadFontAsync(font);
  }

  return {
    ok: true,
    fonts,
    fallback: false,
    warnings: [
      `loadFontsForTextNode: node ${node.id} has mixed fonts; verify styled ranges after mutation`,
    ],
  };
}

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
  const fontResult = await loadFontsForTextNode(node);
  warnings.push(...fontResult.warnings);
  node.characters = newText;
  const applyResult = await applyStyleProfile(node, profile);
  warnings.push(...applyResult.warnings);
  return { ok: true, warnings };
}

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
