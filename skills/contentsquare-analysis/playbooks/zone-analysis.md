# Zone Analysis

Use for component interaction, click behaviour, exposure, scroll, and stateful UI
questions.

## Capability Check

First confirm whether the MCP can access the needed zone data. If not, provide a
Contentsquare UI handoff checklist.

## Validity Checks

- Exposure rate must match how often the element is actually present.
- Coordinate zones can measure a region rather than an element.
- State-dependent controls that occupy the same screen space can contaminate each other.
- Transient controls may need selector-based zones or custom events.
- Old-vs-new comparison only works if the old component was zoned before launch.
- Identical metrics across several zones can indicate co-mapped elements.

## UI Handoff Checklist

Ask the user or analyst to capture:

- page group and mapping;
- date range, device, and segment;
- zone name and definition method;
- exposure rate;
- click or interaction rate;
- time to first interaction where relevant;
- screenshot or description of what the zone covers.

## Output

State whether the zone measures an element, a region, or an uncertain proxy.
Separate observation, interpretation, recommendation, next check, and caveat.
