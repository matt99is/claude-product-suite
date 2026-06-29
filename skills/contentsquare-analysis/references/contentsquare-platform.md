# Contentsquare Platform Reference

Use this reference before querying or interpreting Contentsquare data. CS is the
only supported platform in v1.

## Contentsquare Entities

- Mappings group URLs into analysis structures. Confirm the mapping before using page groups.
- Page groups are analysis objects, not just labels. Duplicate names can exist, so use object IDs.
- Segments define populations and can change funnel denominators. Validate segment size before trusting a split.
- Funnels measure ordered page or step progression. Optional pages should be branches, not mandatory steps.
- Goals may be shared, stale, or click-based. Do not reuse a goal conversion rate without checking its definition.
- Errors capture technical events, but impact metrics can mix recoveries, failures, and modelled opportunity.
- Journeys show paths and detours, but need scoped interpretation by date, device, segment, and mapping.
- Zones measure component or region interaction. Exposure rate is the first validity check.
- Dashboards and saved objects are useful only when their underlying mappings, page groups, filters, and segments are known.

## MCP Capability Check

Before live analysis, confirm:

1. The Contentsquare MCP is available.
2. Authentication works.
3. The target project, site, mapping, and date range are explicit.
4. The MCP can access the entities needed for the question.
5. Any missing MCP capability is named as a UI handoff.

Treat the MCP as an execution surface. It is not proof that the selected object
or segment is the right one.

## UI-Only Or Often UI-Led Checks

Some work may need the Contentsquare UI even when MCP access exists:

- zone creation, screenshots, and visual zone validation;
- dashboard layout review;
- saved-object discovery when MCP tools cannot list the right object type;
- object naming disambiguation where several mappings or page groups look alike;
- visual journey exploration that needs screenshots or path diagrams.

When the UI is required, provide a short checklist rather than inventing results.

## Validation Pitfalls

- Object names are not stable identifiers. Pin mappings, page groups, segments, funnels, and goals by object IDs.
- Optional or conditional pages create false cliffs when treated as mandatory funnel steps.
- A segment changes the entry denominator; a segment split is only valid after checking populations.
- Mutually exclusive segment partitions should sum to the parent population within expected tolerances.
- Empty results can mean no behaviour, a bad object, segment lag, or an over-restrictive filter.
- Device differences are often material. Do not blend devices unless the question justifies it.
- A favourable metric that contradicts the rest of the evidence is "Verify", not a headline.
- Zoning exposure rate must match whether the component is actually present.
- Coordinate zones can measure a region rather than an element, especially for state-dependent controls.
- Error impact must separate sessions affected, observable abandoners, recoveries, and modelled missed opportunity.

## Blind Spots

Contentsquare may not answer source/channel, ad spend, full revenue ownership,
payment decline reason, identity-provider behaviour, experimentation assignment,
server logs, or deploy history. Name the blind spot and route it to the project
owner instead of inferring it from CS behaviour.
