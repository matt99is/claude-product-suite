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
  assert.match(skill, /design-critique/i);
  assert.match(skill, /future capability/i);
});

test('router references include capability map and pitfalls', async () => {
  const capabilityMap = await read('skills/product-suite-router/references/capability-map.md');
  const pitfalls = await read('skills/product-suite-router/references/routing-pitfalls.md');

  assert.match(capabilityMap, /Research/i);
  assert.match(capabilityMap, /Figma writing/i);
  assert.match(capabilityMap, /Design critique/i);
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

test('design critique skill enforces artefact-only source-grounded critique', async () => {
  const skill = await read('skills/design-critique/SKILL.md');
  const principles = await read('skills/design-critique/references/principles-library.md');
  const playbook = await read('skills/design-critique/playbooks/artefact-critique.md');

  assert.match(skill, /name:\s*design-critique/);
  assert.match(skill, /static design artefacts/i);
  assert.match(skill, /context/i);
  assert.match(skill, /primary objective/i);
  assert.match(skill, /severity/i);
  assert.match(skill, /confidence/i);
  assert.match(skill, /visual accessibility only/i);
  assert.match(skill, /research/i);

  assert.match(principles, /WCAG 2\.2/i);
  assert.match(principles, /Nielsen Norman Group/i);
  assert.match(principles, /Baymard/i);
  assert.match(principles, /24 by 24 CSS pixels/i);
  assert.match(principles, /4\.5:1/i);
  assert.match(principles, /3:1/i);
  assert.match(principles, /48 by 48 dp/i);
  assert.match(principles, /44 by 44 pt/i);
  assert.match(principles, /Do not claim full accessibility compliance/i);

  assert.match(playbook, /What works/i);
  assert.match(playbook, /Issue/i);
  assert.match(playbook, /Principle/i);
  assert.match(playbook, /Consequence/i);
  assert.match(playbook, /Recommendation/i);
});

test('figma learning command keeps public learning local by default', async () => {
  const command = await read('commands/figma-learn.md');

  assert.match(command, /Capture a new Figma writing learning/i);
  assert.match(command, /Show the draft to the user/i);
  assert.match(command, /Wait for approval/i);
  assert.match(command, /local learning/i);
  assert.match(command, /Do not run `git commit` by default/i);
  assert.match(command, /maintainer/i);
});

test('research learning command keeps public learning local by default', async () => {
  const command = await read('commands/research-learn.md');

  assert.match(command, /Capture a new research learning/i);
  assert.match(command, /Show the draft to the user/i);
  assert.match(command, /Wait for approval/i);
  assert.match(command, /local learning/i);
  assert.match(command, /Do not run `git commit` by default/i);
  assert.match(command, /maintainer/i);
  assert.match(command, /research-pitfalls/i);
});


test('release documentation defines changelog and semantic versioning', async () => {
  const changelog = await read('CHANGELOG.md');
  const releaseDoc = await read('docs/release.md');
  const readme = await read('README.md');

  assert.match(changelog, /# Changelog/i);
  assert.match(changelog, /## \[0\.2\.0\]/);
  assert.match(changelog, /Keep a Changelog/i);
  assert.match(releaseDoc, /Semantic Versioning/i);
  assert.match(releaseDoc, /patch/i);
  assert.match(releaseDoc, /minor/i);
  assert.match(releaseDoc, /major/i);
  assert.match(releaseDoc, /package\.json/);
  assert.match(releaseDoc, /plugin\.json/);
  assert.match(releaseDoc, /git tag v/);
  assert.match(readme, /plugin update claude-product-suite/i);
  assert.match(readme, /design-critique/i);
});

test("roadmap captures planned suite capabilities", async () => {
  const roadmap = await read("docs/roadmap.md");

  assert.match(roadmap, /# Roadmap/i);
  assert.match(roadmap, /## Now/i);
  assert.match(roadmap, /## Next/i);
  assert.match(roadmap, /## Later/i);
  assert.match(roadmap, /user testing/i);
  assert.match(roadmap, /UserTesting\.com/i);
  assert.match(roadmap, /wireframing/i);
  assert.match(roadmap, /chart/i);
  assert.match(roadmap, /graph/i);
  assert.match(roadmap, /table/i);
  assert.match(roadmap, /Figma skill/i);
  assert.match(roadmap, /brainstorming/i);
  assert.match(roadmap, /prototyping/i);
  assert.match(roadmap, /centralised design library/i);
  assert.match(roadmap, /reusable components/i);
});

test("README documents correct plugin reinstall command", async () => {
  const readme = await read("README.md");

  assert.match(readme, /claude-product-suite@claude-product-suite/);
  assert.doesNotMatch(readme, /claude-product-suite-product-suite/);
});


test('package and plugin manifest versions stay in sync', async () => {
  const pkg = JSON.parse(await read('package.json'));
  const plugin = JSON.parse(await read('.claude-plugin/plugin.json'));

  assert.equal(pkg.version, plugin.version);
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
});

test('plugin marketplace manifest supports GitHub installation', async () => {
  const manifest = JSON.parse(await read('.claude-plugin/marketplace.json'));

  assert.equal(manifest.name, 'claude-product-suite');
  assert.equal(manifest.owner.name, 'Matthew Lelonek');
  assert.match(manifest.metadata.description, /Product, design, UX research/);
  assert.equal(manifest.plugins[0].name, 'claude-product-suite');
  assert.equal(manifest.plugins[0].source, './');
});
