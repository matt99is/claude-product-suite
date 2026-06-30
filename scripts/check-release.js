#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const RELEASE_PATHS = [
  '.claude-plugin',
  'commands',
  'skills',
  'README.md',
  'CHANGELOG.md',
];

function fail(message) {
  console.error(`Release governance check failed: ${message}`);
  process.exitCode = 1;
}

function readJson(path, ref = null) {
  const text = ref
    ? execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8' })
    : readFileSync(path, 'utf8');
  return JSON.parse(text);
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function compareVersions(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < 3; i += 1) {
    if (aParts[i] > bParts[i]) return 1;
    if (aParts[i] < bParts[i]) return -1;
  }

  return 0;
}

function parseChangelogVersions(changelog) {
  return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - \d{4}-\d{2}-\d{2}$/gm)]
    .map(match => match[1]);
}

function parseTags() {
  const output = git(['tag', '--list', 'v[0-9]*.[0-9]*.[0-9]*', '--sort=-version:refname']);
  return output ? output.split('\n').filter(Boolean) : [];
}

function getChangedReleaseFilesSince(tag) {
  const diffOutput = git([
    'diff',
    '--name-only',
    tag,
    '--',
    ...RELEASE_PATHS,
  ]);
  const changed = diffOutput ? diffOutput.split('\n').filter(Boolean) : [];

  const untrackedOutput = git(['ls-files', '--others', '--exclude-standard', '--', ...RELEASE_PATHS]);
  const untracked = untrackedOutput ? untrackedOutput.split('\n').filter(Boolean) : [];

  return [...new Set([...changed, ...untracked])];
}

function main() {
  const requireCurrentTag = process.argv.includes('--require-current-tag');
  const pkg = readJson('package.json');
  const plugin = readJson('.claude-plugin/plugin.json');
  const changelog = readFileSync('CHANGELOG.md', 'utf8');
  const changelogVersions = parseChangelogVersions(changelog);
  const tags = parseTags();
  const tagVersions = new Set(tags.map(tag => tag.slice(1)));
  const currentVersion = pkg.version;
  let failed = false;

  const check = (condition, message) => {
    if (!condition) {
      fail(message);
      failed = true;
    }
  };

  check(/^\d+\.\d+\.\d+$/.test(currentVersion), `package.json version is not semver: ${currentVersion}`);
  check(pkg.version === plugin.version, `package.json version ${pkg.version} does not match plugin version ${plugin.version}`);
  check(changelogVersions.includes(currentVersion), `CHANGELOG.md has no release entry for ${currentVersion}`);

  for (const version of changelogVersions) {
    check(
      compareVersions(version, currentVersion) <= 0,
      `CHANGELOG.md contains future release ${version} beyond package version ${currentVersion}`,
    );

    if (version !== currentVersion) {
      check(tagVersions.has(version), `CHANGELOG.md release ${version} is missing git tag v${version}`);
    }
  }

  for (const tag of tags) {
    const version = tag.slice(1);
    check(
      changelogVersions.includes(version),
      `git tag ${tag} has no matching CHANGELOG.md release heading`,
    );

    let taggedPackage;
    let taggedPlugin;
    try {
      taggedPackage = readJson('package.json', tag);
      taggedPlugin = readJson('.claude-plugin/plugin.json', tag);
    } catch (error) {
      check(false, `could not read version files at ${tag}: ${error.message}`);
      continue;
    }

    check(
      taggedPackage.version === version,
      `${tag} points to package.json version ${taggedPackage.version}, expected ${version}`,
    );
    check(
      taggedPlugin.version === version,
      `${tag} points to plugin manifest version ${taggedPlugin.version}, expected ${version}`,
    );
  }

  const latestTag = tags[0];
  if (latestTag) {
    const latestVersion = latestTag.slice(1);
    check(
      compareVersions(currentVersion, latestVersion) >= 0,
      `package version ${currentVersion} is behind latest tag ${latestTag}`,
    );

    const changedReleaseFiles = getChangedReleaseFilesSince(latestTag);
    if (changedReleaseFiles.length > 0) {
      check(
        compareVersions(currentVersion, latestVersion) > 0,
        `user-facing plugin changes since ${latestTag} require package.json version > ${latestVersion}; changed files: ${changedReleaseFiles.join(', ')}`,
      );
    }
  }

  if (requireCurrentTag) {
    check(tagVersions.has(currentVersion), `current release ${currentVersion} is missing git tag v${currentVersion}`);
    if (tagVersions.has(currentVersion)) {
      const tagCommit = git(['rev-list', '-n', '1', `v${currentVersion}`]);
      const headCommit = git(['rev-parse', 'HEAD']);
      check(tagCommit === headCommit, `v${currentVersion} points to ${tagCommit}, not HEAD ${headCommit}`);
    }
  }

  if (!failed) {
    console.log(`Release governance check passed for ${currentVersion}.`);
  }
}

main();
