# Error Impact Analysis

Use when interpreting Contentsquare error analytics, missed-opportunity figures,
or technical friction.

## Setup

1. Identify the error, page group, date range, device, and segment.
2. Check whether the error is counted on render, impression, click, submit, or failed navigation.
3. Confirm whether affected sessions still convert or recover.

## Validation

- Sessions affected are not the same as lost sessions.
- Recoveries should be separated from observable abandoners.
- Observable abandoners are usually sessions with the error plus a behavioural failure condition, such as reaching a step and not reaching the next step.
- Modelled missed opportunity is a counterfactual, not a headcount.
- A render-level warning can have high exposure and low behavioural impact.
- A payment or submit 4xx may be a decline or business outcome rather than a code defect.

## Blind Spots

If the root cause depends on server logs, payment gateway data, identity logs, or
deploy details, name that as outside Contentsquare and route it to the project
owner.

## Output

Report:

1. Error and scope.
2. Failure mode.
3. Sessions affected.
4. Recoveries.
5. Observable abandoners.
6. Interpretation and confidence.
7. Next check.
