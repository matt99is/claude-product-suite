# Changelog

All notable changes to `claude-product-suite` are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) style and uses [Semantic Versioning](https://semver.org/) for public plugin releases.

## [Unreleased]

## [0.5.0] - 2026-06-16

### Added

- Added a design-system-safe Figma writing playbook for creating frames, components, tables, charts, graphs, dashboards, and production-looking UI from existing components, variables, styles, modes, Code Connect mappings, and auto-layout conventions.
- Added guidance for editable table-like structures, truthful chart and graph primitives, chart kit reuse, and avoiding colour-only series distinctions.

### Changed

- Updated Figma writing routing, capability map, README, roadmap, and pitfalls so design-system-safe Figma creation and table/chart/graph guidance are treated as implemented playbook-level guidance rather than future capability.
- Expanded Figma pitfalls for library enablement, design-system component reuse, variable-bound paints, fill-versus-hug auto-layout sizing, and decorative chart risks.


## [0.4.4] - 2026-06-15

### Changed

- Updated Figma setup guidance to attempt available write-capable tools before showing setup instructions, and added surface-specific fallback guidance for Claude Code CLI, Claude Desktop, Claude.ai web or chat, and Claude Cowork.
- Expanded Figma writing pitfalls for auto-layout primary-axis resizing, wrapping diagnostics, stale geometry, async node lookup, mixed-font sources, cross-file style matching, existing table edits, and concurrent editing.
- Added a roadmap item to split the growing Figma pitfalls catalogue into focused references when context cost warrants it.

## [0.4.3] - 2026-06-15

### Fixed

- Corrected Figma setup guidance to use only the official remote Figma MCP plugin and browser authorization for write-to-canvas access, with desktop MCP, personal access tokens, and tunnels treated as non-write setup paths for this skill.

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
