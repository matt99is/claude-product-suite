# Project Workspace Contract

Project-local files carry account, client, and workstream context. The skill
should ask for or load these files when available, but it must not hard-code
their contents.

## Recommended Files

- `tracking-plan.md`: tag coverage, event definitions, page mappings, domains, known gaps, and measurement owners.
- `release-register.md`: launch dates, feature flags, rollout notes, surfaces touched, incidents, and stabilisation notes.
- `saved-objects.md`: project IDs, mapping IDs, page-group IDs, segment IDs, funnel IDs, dashboards, goals, and naming caveats.
- `working-notes.md`: operational detail, validated objects, current caveats, private numbers, and in-progress findings.
- `reports/`: published outputs and drafts to keep format and caveat style consistent.
- `data/raw/` and `data/processed/`: approved exports only, when local files are part of the workflow.
- `screenshots/`: approved UI captures where MCP access is insufficient.

## Loading Rule

Load the smallest context set that can answer the question:

1. Business question or brief.
2. `tracking-plan.md` for measurement coverage.
3. `release-register.md` for launch or change analysis.
4. `saved-objects.md` for IDs and known duplicate-name traps.
5. `working-notes.md` for current caveats and validated objects.
6. Relevant prior reports for output style and repeatability.

## Missing Files

Missing files do not block all analysis. If a file is missing:

- ask for the minimum missing context;
- create a short checklist of what the project should add later;
- label conclusions as provisional when validation depends on missing context;
- avoid saving client-specific IDs or private figures into the bundled skill.

## Minimum Context Checklist

Before a repeatable analysis, try to capture:

- target project or site;
- date range and comparison period;
- mapping or page-group scope;
- device and segment rules;
- known launches or incidents in the period;
- saved object IDs used;
- data caveats and UI handoffs.
