import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
}

test('package exposes a release governance check', async () => {
  const pkg = await readJson('package.json');

  assert.equal(pkg.scripts['release:check'], 'node scripts/check-release.js');
  assert.match(pkg.scripts.check, /npm run release:check/);
});

test('release governance check passes for the current repository state', async () => {
  const { stdout } = await execFileAsync('node', ['scripts/check-release.js']);

  assert.match(stdout, /Release governance check passed/i);
});
