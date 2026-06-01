import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

async function read(path) {
  return await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('product-suite-router skill defines routing boundaries', async () => {
  const skill = await read('skills/product-suite-router/SKILL.md');

  assert.match(skill, /name:\s*product-suite-router/);
  assert.match(skill, /primary intent/i);
  assert.match(skill, /Do not automatically route/i);
  assert.match(skill, /research/i);
  assert.match(skill, /figma-writing/i);
  assert.match(skill, /future capability/i);
});

test('router references include capability map and pitfalls', async () => {
  const capabilityMap = await read('skills/product-suite-router/references/capability-map.md');
  const pitfalls = await read('skills/product-suite-router/references/routing-pitfalls.md');

  assert.match(capabilityMap, /Research/i);
  assert.match(capabilityMap, /Figma writing/i);
  assert.match(capabilityMap, /Wireframing/i);
  assert.match(capabilityMap, /Future/i);

  assert.match(pitfalls, /Over-routing/i);
  assert.match(pitfalls, /False capability/i);
  assert.match(pitfalls, /Chain inflation/i);
});

test('research skill enforces brief-first source-led workflow', async () => {
  const skill = await read('skills/research/SKILL.md');

  assert.match(skill, /name:\s*research/);
  assert.match(skill, /brief/i);
  assert.match(skill, /Never synthesise from memory/i);
  assert.match(skill, /source quality/i);
  assert.match(skill, /NotebookLM/i);
  assert.match(skill, /one URL per line/i);
});

test('research references define source trust and pitfalls', async () => {
  const sourceQuality = await read('skills/research/references/source-quality.md');
  const pitfalls = await read('skills/research/references/research-pitfalls.md');

  assert.match(sourceQuality, /Strong/i);
  assert.match(sourceQuality, /Medium/i);
  assert.match(sourceQuality, /Weak/i);
  assert.match(sourceQuality, /Weak.*Key Evidence/is);
  assert.match(sourceQuality, /one URL per line/i);

  assert.match(pitfalls, /Synthesising from memory/i);
  assert.match(pitfalls, /Weak sources carrying key claims/i);
  assert.match(pitfalls, /Vague brief/i);
});

test('research playbooks cover the first supported workflows', async () => {
  const briefPlan = await read('skills/research/playbooks/brief-to-research-plan.md');
  const sourceLed = await read('skills/research/playbooks/source-led-research.md');
  const synthesis = await read('skills/research/playbooks/evidence-synthesis.md');
  const competitor = await read('skills/research/playbooks/competitor-scan.md');

  assert.match(briefPlan, /What the research must inform/i);
  assert.match(sourceLed, /candidate sources/i);
  assert.match(sourceLed, /clean URL list/i);
  assert.match(synthesis, /supplied source/i);
  assert.match(competitor, /comparison dimensions/i);
});

test('research learning command requires approval before editing', async () => {
  const command = await read('commands/research-learn.md');

  assert.match(command, /Capture a new research learning/i);
  assert.match(command, /Show the draft to the user/i);
  assert.match(command, /Wait for approval/i);
  assert.match(command, /research-pitfalls/i);
});


test('plugin marketplace manifest supports GitHub installation', async () => {
  const manifest = JSON.parse(await read('.claude-plugin/marketplace.json'));

  assert.equal(manifest.name, 'claude-product-suite');
  assert.equal(manifest.owner.name, 'Matthew Lelonek');
  assert.match(manifest.metadata.description, /Product, design, UX research/);
  assert.equal(manifest.plugins[0].name, 'claude-product-suite');
  assert.equal(manifest.plugins[0].source, './');
});
