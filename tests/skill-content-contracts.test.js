import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import test from 'node:test';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);

function compareVersions(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < 3; i += 1) {
    if (aParts[i] > bParts[i]) return 1;
    if (aParts[i] < bParts[i]) return -1;
  }

  return 0;
}

async function read(path) {
  return await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('product-suite-router skill defines routing boundaries', async () => {
  const skill = await read('skills/product-suite-router/SKILL.md');

  assert.match(skill, /name:\s*product-suite-router/);
  assert.match(skill, /primary intent/i);
  assert.match(skill, /toolbox/i);
  assert.match(skill, /Do not force a lifecycle/i);
  assert.match(skill, /independent specialist tools/i);
  assert.match(skill, /Do not automatically route/i);
  assert.match(skill, /research/i);
  assert.match(skill, /figma-writing/i);
  assert.match(skill, /design-critique/i);
  assert.match(skill, /brainstorming/i);
  assert.match(skill, /future capability/i);
});

test('router references include capability map and pitfalls', async () => {
  const capabilityMap = await read('skills/product-suite-router/references/capability-map.md');
  const pitfalls = await read('skills/product-suite-router/references/routing-pitfalls.md');

  assert.match(capabilityMap, /Research/i);
  assert.match(capabilityMap, /Figma writing/i);
  assert.match(capabilityMap, /Design critique/i);
  assert.match(capabilityMap, /Brainstorming.*Implemented/is);
  assert.match(capabilityMap, /Thinking and strategy/i);
  assert.match(capabilityMap, /Evidence and discovery/i);
  assert.match(capabilityMap, /Design quality/i);
  assert.match(capabilityMap, /Making artefacts/i);
  assert.match(capabilityMap, /Testing and iteration/i);
  assert.match(capabilityMap, /Communication/i);
  assert.match(capabilityMap, /Wireframing/i);
  assert.match(capabilityMap, /Future/i);

  assert.match(pitfalls, /Over-routing/i);
  assert.match(pitfalls, /False capability/i);
  assert.match(pitfalls, /Chain inflation/i);
  assert.match(pitfalls, /Lifecycle forcing/i);
  assert.match(pitfalls, /Brainstorming Over-Capture/i);
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

test('figma writing skill guards write-capable setup', async () => {
  const skill = await read('skills/figma-writing/SKILL.md');
  const setup = await read('skills/figma-writing/references/setup-and-permissions.md');

  assert.match(skill, /write-capable Figma MCP/i);
  assert.match(skill, /setup-and-permissions\.md/);
  assert.match(skill, /claude plugin install figma@claude-plugins-official/);
  assert.match(skill, /edit access/i);

  assert.match(setup, /remote Figma MCP server/i);
  assert.match(setup, /desktop Figma MCP server/i);
  assert.match(setup, /figma-use/i);
  assert.match(setup, /Skills do not add MCP capabilities/i);
  assert.match(setup, /read-only/i);
  assert.match(setup, /\/plugin/);
  assert.match(setup, /\/mcp/);
  assert.match(setup, /claude plugin install figma@claude-plugins-official/);
});

test('figma writing skill covers process maps and flow charts', async () => {
  const skill = await read('skills/figma-writing/SKILL.md');
  const pitfalls = await read('skills/figma-writing/references/pitfalls.md');
  const playbook = await read('skills/figma-writing/playbooks/create-process-map-or-flowchart.md');

  assert.match(skill, /process map/i);
  assert.match(skill, /flow chart/i);
  assert.match(skill, /create-process-map-or-flowchart\.md/);

  assert.match(pitfalls, /diagram/i);
  assert.match(pitfalls, /Connector/i);
  assert.match(pitfalls, /decision diamond/i);

  assert.match(playbook, /reference frame/i);
  assert.match(playbook, /existing process map/i);
  assert.match(playbook, /go-to style/i);
  assert.match(playbook, /green milestone/i);
  assert.match(playbook, /pink diamond/i);
  assert.match(playbook, /sequential, parallel, repeated, conditional, or independent/i);
});
test('figma writing skill covers style-matched node creation and mixed fonts', async () => {
  const skill = await read('skills/figma-writing/SKILL.md');
  const pitfalls = await read('skills/figma-writing/references/pitfalls.md');
  const playbook = await read('skills/figma-writing/playbooks/build-nodes-matching-existing-style.md');
  const handTest = await read('docs/hand-test-figma-helpers.md');

  assert.match(skill, /style-matched node creation/i);
  assert.match(skill, /build-nodes-matching-existing-style.md/);

  assert.match(pitfalls, /Mixed-font text requires segment font loading/i);
  assert.match(pitfalls, /Optional API property access can throw/i);
  assert.match(pitfalls, /Style-matched node creation/i);

  assert.match(playbook, /style source/i);
  assert.match(playbook, /read-only probe/i);
  assert.match(playbook, /clone text-heavy/i);
  assert.match(playbook, /extracted fills, strokes, radii, typography/i);

  assert.match(handTest, /mixed styled text segments/i);
  assert.match(handTest, /loadFontsForTextNode/i);
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
  assert.match(roadmap, /modular toolbox/i);
  assert.match(roadmap, /not a prescribed product lifecycle/i);
  assert.match(roadmap, /## Product Direction/i);
  assert.match(roadmap, /## Toolbox Areas/i);
  assert.match(roadmap, /## Near-Term Priorities/i);
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

test("README frames the suite as a modular toolbox", async () => {
  const readme = await read("README.md");

  assert.match(readme, /modular toolbox/i);
  assert.match(readme, /product teams/i);
  assert.match(readme, /without forcing a prescribed lifecycle/i);
  assert.match(readme, /independently or combined/i);
  assert.match(readme, /brainstorming/i);
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

test("user-facing plugin changes require a new release version", async () => {
  const pkg = JSON.parse(await read("package.json"));
  const { stdout: tagOutput } = await execFileAsync("git", [
    "tag",
    "--list",
    "v[0-9]*.[0-9]*.[0-9]*",
    "--sort=-version:refname",
  ]);
  const latestTag = tagOutput.trim().split("\n").filter(Boolean)[0];

  assert.ok(latestTag, "expected at least one semver release tag");

  const releasedVersion = latestTag.slice(1);
  const { stdout: diffOutput } = await execFileAsync("git", [
    "diff",
    "--name-only",
    latestTag,
    "--",
    ".claude-plugin",
    "commands",
    "skills",
    "README.md",
    "CHANGELOG.md",
  ]);
  const changedReleaseFiles = diffOutput.trim().split("\n").filter(Boolean);

  if (changedReleaseFiles.length > 0) {
    assert.ok(
      compareVersions(pkg.version, releasedVersion) > 0,
      `user-facing plugin changes since ${latestTag} require package.json version > ${releasedVersion}; changed files: ${changedReleaseFiles.join(", ")}`,
    );
  }
});


test("plugin marketplace manifest supports GitHub installation", async () => {
  const manifest = JSON.parse(await read('.claude-plugin/marketplace.json'));

  assert.equal(manifest.name, 'claude-product-suite');
  assert.equal(manifest.owner.name, 'Matthew Lelonek');
  assert.match(manifest.metadata.description, /Product-team toolbox/);
  assert.equal(manifest.plugins[0].name, 'claude-product-suite');
  assert.equal(manifest.plugins[0].source, './');
});


test('usertesting skill supports low-bias platform-realistic studies', async () => {
  const skill = await read('skills/usertesting/SKILL.md');
  const platform = await read('skills/usertesting/references/platform-capabilities.md');
  const guardrails = await read('skills/usertesting/references/bias-and-quality-guardrails.md');
  const plan = await read('skills/usertesting/playbooks/plan-unmoderated-test.md');
  const synthesis = await read('skills/usertesting/playbooks/synthesize-results.md');

  assert.match(skill, /name:\s*usertesting/);
  assert.match(skill, /UserTesting.com/i);
  assert.match(skill, /audience/i);
  assert.match(skill, /screener/i);
  assert.match(skill, /verbal responses/i);
  assert.match(skill, /concise/i);
  assert.match(skill, /bias/i);
  assert.match(skill, /Excel export/i);
  assert.match(skill, /synthesis/i);

  assert.match(platform, /audience filters/i);
  assert.match(platform, /screener/i);
  assert.match(platform, /tasks/i);
  assert.match(platform, /verbal response/i);
  assert.match(platform, /rating/i);
  assert.match(platform, /success/i);
  assert.match(platform, /difficulty/i);
  assert.match(platform, /transcripts/i);
  assert.match(platform, /Excel export/i);

  assert.match(guardrails, /goal/i);
  assert.match(guardrails, /not step-by-step/i);
  assert.match(guardrails, /leading/i);
  assert.match(guardrails, /written responses/i);
  assert.match(guardrails, /qualitative/i);
  assert.match(guardrails, /statistical/i);

  assert.match(plan, /Decision to inform/i);
  assert.match(plan, /Target audience/i);
  assert.match(plan, /Screener/i);
  assert.match(plan, /15-20 minutes/i);
  assert.match(plan, /pilot/i);
  assert.match(plan, /verbal/i);

  assert.match(synthesis, /data received/i);
  assert.match(synthesis, /participant/i);
  assert.match(synthesis, /task/i);
  assert.match(synthesis, /evidence/i);
  assert.match(synthesis, /visual/i);
  assert.match(synthesis, /confidence/i);
});

test('brainstorming skill supports product design ideation without over-routing', async () => {
  const skill = await read('skills/brainstorming/SKILL.md');
  const qualityBar = await read('skills/brainstorming/references/brainstorming-quality-bar.md');
  const pitfalls = await read('skills/brainstorming/references/brainstorming-pitfalls.md');
  const shapeGenerate = await read('skills/brainstorming/playbooks/shape-and-generate.md');
  const compareNarrow = await read('skills/brainstorming/playbooks/compare-and-narrow.md');

  assert.match(skill, /name:\s*brainstorming/);
  assert.match(skill, /product/i);
  assert.match(skill, /design/i);
  assert.match(skill, /creative/i);
  assert.match(skill, /Diverge/i);
  assert.match(skill, /Shape/i);
  assert.match(skill, /Compare/i);
  assert.match(skill, /Narrow/i);
  assert.match(skill, /Translate/i);
  assert.match(skill, /Do not use brainstorming/i);
  assert.match(skill, /research/i);
  assert.match(skill, /design-critique/i);
  assert.match(skill, /usertesting/i);
  assert.match(skill, /figma-writing/i);
  assert.match(skill, /creative possibilit/i);
  assert.match(skill, /validated/i);
  assert.match(skill, /handoff/i);

  assert.match(qualityBar, /specific/i);
  assert.match(qualityBar, /audience/i);
  assert.match(qualityBar, /varied/i);
  assert.match(qualityBar, /assumptions/i);
  assert.match(qualityBar, /actionable/i);

  assert.match(pitfalls, /idea soup/i);
  assert.match(pitfalls, /premature narrowing/i);
  assert.match(pitfalls, /evidence/i);
  assert.match(pitfalls, /over-routing/i);
  assert.match(pitfalls, /generic/i);
  assert.match(pitfalls, /overbuilding/i);

  assert.match(shapeGenerate, /fuzzy/i);
  assert.match(shapeGenerate, /option/i);
  assert.match(shapeGenerate, /theme/i);

  assert.match(compareNarrow, /criteria/i);
  assert.match(compareNarrow, /tradeoff/i);
  assert.match(compareNarrow, /recommend/i);
  assert.match(compareNarrow, /what would change/i);
});
