# Tables, Charts, and Diagrams Pitfalls

Use for table editing, process maps, flow charts, charts, and graphs.

Each entry uses the same four-part format: **Symptom**, **Cause**, **Correct pattern**, **When this matters**.

---

## Native or plugin-created tables

### Existing table nodes need inspection before editing

#### Symptom
Editing an existing table changes the wrong row, loses per-column styling, or
new rows look different from the existing data rows.

#### Cause
Tables may be native or plugin-created structures with row/cell APIs and
default styles for newly inserted cells. Row indices shift as rows are inserted,
and user edits can move the intended target away from a fixed row number.

#### Correct pattern
Do not promise native table creation from scratch. When editing an existing
plugin-created table or native table-like node, inspect its API and structure
first. If row/cell APIs are available, use patterns such as `table.insertRow(i)`,
`table.cellAt(row, col)`, `cell.text.characters`, and `cell.fills`; load
`cell.text.fontName` before setting text. Capture an existing data row's
per-column style and re-apply it to new or edited cells. Insert multiple rows
bottom-up or track shifted indices. Identify target rows by a content marker
rather than a remembered fixed index.

#### When this matters
Tables created by Figma features or third-party plugins that Claude is asked to
edit, extend, or restyle in place.

---

---

## Diagrams and process maps

### Connector nodes are unavailable or blocked

#### Symptom
A process map script fails when creating Connector, Sticky, or ShapeWithText
nodes, or the nodes do not appear in the target design file.

#### Cause
Some FigJam-style or convenience diagram node types are unavailable or blocked
in design files through the Figma plugin API.

#### Correct pattern
Draw diagram connectors with design-safe primitives: rectangle or line shafts
for orthogonal segments, plus vector arrowheads. For branching flows, route a
horizontal stub to a vertical bus, then draw per-lane arrows from the bus.
Route loop-backs above or below lanes so they do not collide with node labels.

#### When this matters
Any process map, flow chart, journey map, service blueprint, or workflow
diagram created in a Figma design file.

### Decision diamonds cannot contain their labels

#### Symptom
A decision diamond renders without text, or the label drifts when the map is
repositioned.

#### Cause
Polygon nodes are shapes, not text containers. Attempting to treat the diamond
as a parent for text does not create a reliable labelled decision node.

#### Correct pattern
Create the diamond as a polygon and place the decision label as a sibling text
node positioned over it. Group or frame the polygon and label together when
repositioning matters.

#### When this matters
Any flow chart or process map with branch decisions.

### Generic diagram style ignores the host file

#### Symptom
A new process map looks technically correct but visually disconnected from
the surrounding Figma file.

#### Cause
The script built from generic flow-chart defaults instead of first inspecting
an existing process map or reference frame in the file.

#### Correct pattern
Before creating a diagram, inspect the nearest existing process map or user
provided reference frame and reuse its visual vocabulary: containers, title
cards, node styles, decision diamonds, connector routing, legends, spacing,
and placeholder treatments. If no reference exists, use the process-map
playbook go-to style as the default starting point.

#### When this matters
Stakeholder maps, process maps, flow charts, and any artefact that should feel
like part of an existing Figma working file.

---

## Charts and graphs

### Charts built from decoration instead of data

#### Symptom
A chart looks polished but has misleading proportions, missing labels, missing source notes, inaccessible colour distinctions, or values that cannot be traced to supplied data.

#### Cause
The script treated the chart as decorative UI rather than a data display with a scale, semantics, and design-system rules.

#### Correct pattern
Confirm chart type, values, units, time period, comparison baseline, and target insight before drawing. Prefer an existing chart kit or component set when present. Include title, axes or scale, labels, legend, source note, and direct annotation for the key value. Do not use colour alone to distinguish series or meaning.

#### When this matters
Dashboards, metric cards, research summaries, product analytics, executive reports, and any generated chart or graph.
