import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(
  new URL('../skills/figma-writing/helpers/figma-helpers.js', import.meta.url),
  'utf8'
);
const harness = new Function(
  `${src}\nreturn { getTextStyleIdCompat, loadFontsForTextNode, setTextPreservingBindings };`
);
const {
  getTextStyleIdCompat,
  loadFontsForTextNode,
  setTextPreservingBindings,
} = harness();

const mixed = Symbol('figma.mixed');
let loadedFonts;

beforeEach(() => {
  loadedFonts = [];
  globalThis.figma = {
    mixed,
    loadFontAsync: async (font) => {
      loadedFonts.push(font);
    },
  };
});

afterEach(() => {
  delete globalThis.figma;
});

test('getTextStyleIdCompat falls back when optional async getter access throws', async () => {
  const node = {
    get getTextStyleIdAsync() {
      throw new Error('no such property getTextStyleIdAsync');
    },
    textStyleId: 'style-sync',
  };

  const id = await getTextStyleIdCompat(node);

  assert.equal(id, 'style-sync');
});

test('getTextStyleIdCompat returns empty string when async and sync style reads fail', async () => {
  const node = {
    get getTextStyleIdAsync() {
      throw new Error('no such property getTextStyleIdAsync');
    },
    get textStyleId() {
      throw new Error('no such property textStyleId');
    },
  };

  const id = await getTextStyleIdCompat(node);

  assert.equal(id, '');
});

test('loadFontsForTextNode loads each unique segment font on mixed-font text', async () => {
  const inter = { family: 'Inter', style: 'Regular' };
  const tt = { family: 'TT Commons Pro', style: 'Bold' };
  const node = {
    id: 'mixed-title',
    type: 'TEXT',
    fontName: mixed,
    getStyledTextSegments: () => [
      { fontName: inter },
      { fontName: tt },
      { fontName: { family: 'Inter', style: 'Regular' } },
    ],
  };

  const result = await loadFontsForTextNode(node);

  assert.equal(result.ok, true);
  assert.equal(result.fonts.length, 2);
  assert.deepEqual(loadedFonts, [inter, tt]);
  assert.match(result.warnings[0], /mixed fonts/i);
});

test('setTextPreservingBindings loads mixed segment fonts before changing characters', async () => {
  const inter = { family: 'Inter', style: 'Regular' };
  const tt = { family: 'TT Commons Pro', style: 'Bold' };
  const node = {
    id: 'mixed-body',
    type: 'TEXT',
    characters: 'Old',
    fontName: mixed,
    fillStyleId: '',
    textDecoration: 'NONE',
    textCase: 'ORIGINAL',
    lineHeight: { unit: 'AUTO' },
    letterSpacing: { unit: 'PIXELS', value: 0 },
    getStyledTextSegments: () => [{ fontName: inter }, { fontName: tt }],
  };

  const result = await setTextPreservingBindings(node, 'New copy');

  assert.equal(result.ok, true);
  assert.equal(node.characters, 'New copy');
  assert.deepEqual(loadedFonts, [inter, tt]);
  assert.match(result.warnings.join('\n'), /mixed fonts/i);
});
