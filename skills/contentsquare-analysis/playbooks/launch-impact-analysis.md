# Launch Impact Analysis

Use for releases, UX changes, feature flags, incidents, and before/after
questions.

## Start With The Release Register

Read `release-register.md` before attributing movement. Contentsquare does not
know what shipped unless the project records it.

Capture:

- launch date and time if known;
- rollout or feature flag state;
- surface touched;
- expected behavioural hypothesis;
- known incidents or overlapping launches.

## Windowing

- Use like-for-like windows.
- Keep weekday mix comparable.
- Exclude launch-day instability or add a stabilisation gap when appropriate.
- Keep device and segment filters consistent.
- Scope to the surface touched by the change.

## Validation

- Check whether movement appears on the touched surface before reading site-wide aggregates.
- Do not infer causation from timing alone.
- For micro-interactions, aggregate page metrics may hide real impact on the affected subset.
- If old component data was not captured before launch, state the limit.

## Output

Use observation, interpretation, recommendation, next check, and caveat. Include
the release-register entry, windows, filters, and object IDs needed to repeat the
analysis.
