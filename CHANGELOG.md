# Changelog

All notable changes to `claude-product-suite` are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) style and uses [Semantic Versioning](https://semver.org/) for public plugin releases.

## [Unreleased]

### Added

- Added `design-critique`, a standalone source-grounded UX critique skill for static design artefacts with a baked-in principles library, severity-ranked findings, visual-accessibility limits, and optional research escalation.
- Added `docs/roadmap.md` as the working backlog for planned suite capabilities, including Figma wireframing, UserTesting.com workflows, brainstorming, and high-fidelity prototyping.
- Added content-contract coverage for the roadmap and README plugin reinstall command.

### Changed

- Reframed the suite as a modular product-team toolbox rather than a prescribed product lifecycle.
- Updated `product-suite-router` to classify requests by job-to-be-done, avoid lifecycle forcing, and compose specialist skills only when needed.
- Reorganised `docs/roadmap.md` around toolbox areas: thinking and strategy, evidence and discovery, design quality, making artefacts, testing and iteration, and communication.
- Added content-contract coverage for toolbox-oriented router and roadmap behavior.

### Fixed

- Fixed the README fallback reinstall command for GitHub marketplace installs.

## [0.2.0] - 2026-06-01

### Added

- Added `CHANGELOG.md` and `docs/release.md` to document release history, Semantic Versioning rules, and the release checklist.
- Added content-contract tests that keep package and plugin manifest versions synchronized and require release documentation.

### Changed

- Made `/figma-learn` and `/research-learn` local by default so public users can capture personal learning without editing the bundled plugin or creating git commits.
- Documented maintainer learning as normal project work with explicit approval, checks, and local commits.
- Updated README guidance for plugin updates after GitHub changes are published.

## [0.1.0] - 2026-06-01

### Added

- Initial private plugin release with `figma-writing`, `product-suite-router`, and `research` skills.
- Added Figma helper preamble, Figma playbooks, research playbooks, learning commands, plugin manifests, and Node content-contract tests.
