# Funnel And Journey Analysis

Use for funnels, journeys, conversion paths, step drops, route comparison, and
leak diagnosis.

## Setup

1. Confirm mapping and page-group object IDs.
2. Define the start and end points.
3. Identify optional or conditional steps before building the funnel.
4. Pick date range, comparison period, device, and segment.
5. Confirm whether the MCP can query the funnel or whether a UI handoff is needed.

## Validation

- Optional pages are branches, not mandatory steps.
- Device groups are reported separately when behaviour differs.
- Segment populations are checked before comparing pass rates.
- Mutually exclusive segments sum to the parent population when used as partitions.
- Confirmation or final-step counts reconcile to the best available CS confirmation measure when conversion is the claim.
- Duplicate page-group names are resolved by object IDs.

## Analysis

Rank issues by behavioural impact:

```text
drop rate x sessions affected = rough impact priority
```

Compare step-level loss before interpreting the cause. A high completion rate can
mean a high-intent subset, not necessarily a healthy journey.

## Output

For each issue, use observation, interpretation, recommendation, next check, and
caveat. Include the exact funnel steps, date range, device, segment, and object
IDs needed to repeat the analysis.
