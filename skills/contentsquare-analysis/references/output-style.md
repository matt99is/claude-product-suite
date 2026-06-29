# Output Style

Contentsquare analysis outputs should be clear enough for stakeholders and
repeatable enough for analysts. Use plain language, no hype, no urgency framing,
and no hidden method.

## Default Structure

1. Question answered.
2. Data used: project, date range, comparison, device, segment, Contentsquare objects, and MCP/UI caveats.
3. Headline read.
4. Findings.
5. Confidence and caveats.
6. Repeatability notes.

## Finding Format

- Observation:
- Interpretation:
- Recommendation:
- Next check:
- Caveat:

Keep observation and interpretation separate. Observation is what CS shows.
Interpretation is the analyst read. Recommendation is what to do or investigate
next. Next check is the validation or follow-up that would raise confidence.
Caveat names the limit.

## Stakeholder Summary

Use for leadership, product owners, and broad distribution:

- lead with the question and the plain-language answer;
- show only the numbers needed to understand the conclusion;
- group findings by business impact;
- include confidence and named blind spots;
- avoid drama, alarm colours, or "act now" language.

## Analyst Note

Use for teams who need to rerun or challenge the work:

- include object IDs, date ranges, device and segment definitions;
- show validation checks and failed checks;
- distinguish MCP-derived data from UI handoff observations;
- include repeatability notes and next queries.

## Confidence And Caveats

Use confidence labels sparingly:

- High: object scope and segment logic are validated and the pattern is consistent.
- Medium: evidence is directionally useful but one validation check is missing or UI-only.
- Low: output is exploratory, provisional, or blocked by missing project context.

Label likely artefacts as "Verify". Do not turn them into headlines.

## Repeatability

End analyst-facing outputs with enough detail for rerun:

- saved object IDs or names plus disambiguation;
- date range and comparison period;
- device and segment filters;
- MCP query or UI path used;
- validation checks performed;
- open checks still needed.
