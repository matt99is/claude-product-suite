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
