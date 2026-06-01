# Release Process

`claude-product-suite` uses Semantic Versioning for public plugin releases. Keep `package.json` and `.claude-plugin/plugin.json` on the same version.

## Semantic Versioning

Use `MAJOR.MINOR.PATCH`.

- `patch`: documentation fixes, typo fixes, test-only changes, and compatible clarifications that do not change command behavior.
- `minor`: new skills, commands, playbooks, references, helper capabilities, or compatible user-facing behavior changes.
- `major`: breaking changes such as renamed skills, removed commands, changed install assumptions, incompatible helper behavior, or changed learning/update defaults.

While the project is below `1.0.0`, use minor releases for meaningful user-facing behavior changes and new capabilities.

## Release Checklist

1. Decide the next version using the Semantic Versioning rules above.
2. Update `package.json`.
3. Update `.claude-plugin/plugin.json`.
4. Update `CHANGELOG.md` with the release date and user-facing changes.
5. Run `npm test`.
6. Run `npm run check`.
7. Commit the release changes.
8. Tag the commit:

```bash
git tag v<version>
```

9. Push the branch and tag:

```bash
git push origin main
git push origin v<version>
```

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
