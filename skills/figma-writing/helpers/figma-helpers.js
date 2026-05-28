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
