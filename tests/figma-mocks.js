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
