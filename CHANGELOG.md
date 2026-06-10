# Changelog

All notable changes to `claude-product-suite` are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) style and uses [Semantic Versioning](https://semver.org/) for public plugin releases.

## [Unreleased]

### Added

- Added a Figma writing playbook for process maps and flow charts, including style-source inspection, a default stakeholder-map style, diagram-safe primitives, and verification guidance.
- Hardened Figma text helpers for optional API property access and mixed-font text nodes, and added a general style-matched node creation playbook.

## [0.4.0] - 2026-06-08

### Added

- Added `brainstorming`, a product/design/creative ideation skill for shaping fuzzy ideas, generating concepts, comparing options, narrowing directions, and creating lightweight handoffs.
- Added brainstorming references and playbooks covering quality bars, pitfalls, shape/generate workflows, and compare/narrow workflows.
- Added content-contract coverage for brainstorming skill boundaries and over-routing risks.

### Changed

- Updated `product-suite-router`, capability map, roadmap, and README so brainstorming is treated as an implemented specialist skill.


## [0.3.0] - 2026-06-08

### Added

- Added `design-critique`, a standalone source-grounded UX critique skill for static design artefacts with a baked-in principles library, severity-ranked findings, visual-accessibility limits, and optional research escalation.
- Added `usertesting`, a UserTesting.com workflow skill for audience and screener definition, concise low-bias unmoderated test planning, export guidance, and qualitative synthesis.
- Added `docs/roadmap.md` as the working backlog for planned suite capabilities, including Figma wireframing, UserTesting.com workflows, brainstorming, and high-fidelity prototyping.
- Added content-contract coverage for the roadmap, README plugin reinstall command, UserTesting.com skill, and release version guard.
- Added Figma setup and permissions guidance for write-capable MCP configuration, read-only symptoms, remote vs desktop server setup, and edit-access troubleshooting.

### Changed

- Reframed the suite as a modular product-team toolbox rather than a prescribed product lifecycle.
- Updated `product-suite-router` to classify requests by job-to-be-done, avoid lifecycle forcing, route UserTesting.com workflows, and compose specialist skills only when needed.
- Reorganised `docs/roadmap.md` around toolbox areas: thinking and strategy, evidence and discovery, design quality, making artefacts, testing and iteration, and communication.
- Bumped the plugin release to `0.3.0` so Claude Code can detect the new installable version.

### Fixed

- Fixed the README fallback reinstall command for GitHub marketplace installs.
- Added a regression test so user-facing plugin changes after the latest release tag require a newer manifest/package version.

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
