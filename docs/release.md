# Release Process

`claude-product-suite` uses Semantic Versioning for public plugin releases. Keep `package.json` and `.claude-plugin/plugin.json` on the same version.

Release bookkeeping is treated as a single unit: version files, changelog
entries, and git tags must agree. Use `npm run release:check` whenever release
state changes.

## Semantic Versioning

Use `MAJOR.MINOR.PATCH`.

- `patch`: documentation fixes, typo fixes, test-only changes, and compatible clarifications that do not change command behavior.
- `minor`: new skills, commands, playbooks, references, helper capabilities, or compatible user-facing behavior changes.
- `major`: breaking changes such as renamed skills, removed commands, changed install assumptions, incompatible helper behavior, or changed learning/update defaults.

While the project is below `1.0.0`, use minor releases for meaningful user-facing behavior changes and new capabilities.

## Release Checklist

1. Keep normal work under `## [Unreleased]` until deciding to release.
2. Decide the next version using the Semantic Versioning rules above.
3. Update `package.json`.
4. Update `.claude-plugin/plugin.json`.
5. Move the relevant `Unreleased` notes into `CHANGELOG.md` under `## [<version>] - YYYY-MM-DD`.
6. Run `npm test`.
7. Run `npm run check`.
8. Commit the release changes.
9. Tag the commit:

```bash
git tag v<version>
```

10. Run the final tagged-release check:

```bash
npm run release:check -- --require-current-tag
```

11. Push the branch and tag:

```bash
git push origin main
git push origin v<version>
```

## Release Governance Check

`npm run release:check` verifies:

- `package.json` and `.claude-plugin/plugin.json` use the same SemVer version.
- `CHANGELOG.md` has a release entry for the current package version.
- Older changelog release headings have matching git tags.
- Existing SemVer tags point to commits where package and plugin versions match the tag.
- User-facing plugin changes after the latest tag require a newer package version.

Before the release commit is tagged, the current package version may be ahead
of the latest git tag. After tagging, use `npm run release:check --
--require-current-tag` to verify that `v<version>` exists and points at `HEAD`.

Do not hand-edit one release artefact by itself. If a historical mismatch is
discovered, repair the whole set deliberately: identify the commit whose version
files match the changelog entry, add the missing tag locally, run the release
check, then decide whether to push the repaired tag.

## User Updates

After a release is pushed to GitHub, users should update their install in Claude Code:

```text
/plugin update claude-product-suite
```

If update does not resolve the GitHub marketplace install, reinstall from the registered marketplace and restart Claude Code:

```text
/plugin install claude-product-suite@claude-product-suite
```

Learning captured by public users stays local by default. It is not part of a release unless the maintainer deliberately turns it into project work and ships it through the checklist above.
