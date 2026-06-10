# Figma writing pitfalls

A catalogue of write-side traps encountered in real Figma plugin work. The
`figma-writing` skill points here pre-flight. Add new entries via
`/figma-learn`.

Each entry uses the same four-part format: **Symptom**, **Cause**,
**Correct pattern**, **When this matters**.

---

## Fonts

### Custom font not available in the cloud renderer

#### Symptom
`setCharacters` throws "font is not loaded", or text falls back to Inter with
a different metric (kerning, x-height, line height drift).

#### Cause
The font is installed on the designer's local machine, but the `use_figma`
MCP runs against Figma's cloud renderer. Only fonts uploaded to the org's
shared font library are loadable in the cloud.

#### Correct pattern
Call `figma.listAvailableFontsAsync()` before assuming a font is loadable.
If the family is missing, surface that to the user and stop. Never
force-swap to Inter as a fallback inside a styled brand layout.

#### When this matters
Any text mutation. Especially first-time scripts against an unfamiliar file.

### Style-name mismatch between foundries

#### Symptom
`loadFontAsync({ family: "TT Commons Pro", style: "Semi Bold" })` throws
"style not found".

#### Cause
Foundries name weights inconsistently: `Semi Bold`, `SemiBold`, `DemiBold`,
`Demibold`. Assuming a style name based on intuition fails.

#### Correct pattern
Read the node's actual `fontName` and pass it to `loadFontForNode`. Do not
construct font objects from intent.

#### When this matters
Any text mutation on bound styles where you have not first inspected the
node's current font.

---

## Design-system bindings

### Mutating a property under a bound style breaks the binding

#### Symptom
The layer's fill goes back to the style's default on the next library update,
or the text decoration is wrong after rebinding the text style.

#### Cause
Setting `node.fontName`, `node.fontSize`, `node.fills`, `node.textDecoration`,
etc. on a node that had a `textStyleId` or `fillStyleId` detaches the
property's link. Even rebinding the style later does not restore the original
local override values: the style's defaults take over.

#### Correct pattern
Use `setTextPreservingBindings(node, text)`. It snapshots the profile, loads
the font, sets characters, then re-applies the snapshot (style first, then
overrides). For non-text mutations, snapshot manually with
`snapshotStyleProfile` and `applyStyleProfile`.

#### When this matters
Any text mutation. Any clone whose properties are subsequently changed.

### Bound variables are lost across mutations

#### Symptom
A token-bound colour or size reverts to the literal value after a script run.

#### Cause
`node.boundVariables` is read-only. Mutating the underlying property unbinds
it. Re-binding requires `node.setBoundVariable(prop, variable)` per property.

#### Correct pattern
Capture `boundVariables` in `snapshotStyleProfile`. Re-apply via
`applyStyleProfile`, which iterates and calls `setBoundVariable` per entry.

#### When this matters
Any file using design tokens. Cloning, text-style swaps, fill-style swaps.

---

## Sibling instances with identical paths

### Path-keyed matching collapses sibling instances

#### Symptom
You clone a frame containing two button instances and update text in both.
After running, only one button shows the update; the other has been
overwritten or skipped.

#### Cause
Both buttons have a text node at the same ancestor path inside their
instance (e.g. `instance/buttonText`). Keying by pathKey collapses both
paths to one key, so the second sibling either overwrites the first or is
silently dropped.

#### Correct pattern
Use `matchTextNodesByIndex(sourceParent, targetParent)`. It walks both
parents in pre-order and pairs text nodes by traversal index. It throws if
text node counts differ, which catches structural drift.

#### When this matters
Any clone of a frame that contains repeated component instances.

---

## Auto-layout

### `appendChild` ignores intended position

#### Symptom
A cloned node ends up at the bottom of an auto-layout frame regardless of
the `x` / `y` you set on it.

#### Cause
`parent.appendChild(node)` places the node at the end of the visual flow in
auto-layout, ignoring positioning hints entirely.

#### Correct pattern
Use `insertChildSafe(parent, index, node)`. It uses `insertChild(index, node)`
when an explicit index is provided, and warns (rather than silently appending)
when the parent is auto-layout and no index is given.

#### When this matters
Any clone or new-node creation inside an auto-layout container.

### Parent re-sizes unexpectedly after a text change

#### Symptom
A fixed-height frame containing text grows or shrinks. Adjacent siblings
get pushed out of position.

#### Cause
Auto-layout parents resize to fit their content when their text children
re-wrap. A text mutation that adds or removes characters can trigger a wrap
change.

#### Correct pattern
After mutating text inside an auto-layout container, screenshot the parent
frame (not just the changed node). Inspect for re-flow. If the parent is
fixed-height and the content overflows, surface that to the user.

#### When this matters
Any text mutation inside an auto-layout container.

---

## Text wrapping

### Forcing `textAutoResize` breaks expanding buttons

#### Symptom
A button's text wraps to multiple ugly lines after a script run, even though
the new text is shorter than the old.

#### Cause
Buttons in design systems often set `textAutoResize: 'WIDTH_AND_HEIGHT'`
so the text node expands inline with the button width. A blanket helper that
forces `textAutoResize: 'HEIGHT'` locks the node to whatever width it had
(often a tiny default like 54px) and forces multi-line wrapping.

#### Correct pattern
Never change `textAutoResize` as a default. If a script needs to, state the
reason out loud and document it on the script.

#### When this matters
Any text mutation inside a design-system button or chip component.

---

## Progress arcs

### Arc starts at the wrong angle or goes the wrong direction

#### Symptom
A progress ring intended to start at 12 o'clock and fill clockwise starts at
3 o'clock or fills counter-clockwise.

#### Cause
Figma's arc convention is non-standard: angle `0` is at the top (12 o'clock)
and positive radians go clockwise. Standard math convention has `0` at the
right (3 o'clock) and positive radians going counter-clockwise.

#### Correct pattern
For a clockwise progress ring filling from the top:
`ellipse.arcData = { startingAngle: 0, endingAngle: (percent/100) * 2 * Math.PI, innerRadius }`.
Preserve `innerRadius` to keep the donut shape.

#### When this matters
Any ellipse with `arcData` (progress rings, gauges, pie segments).

---

## API quirks

### Some getters are async on newer files, sync on older ones

#### Symptom
`node.textStyleId` returns `undefined` or a Promise object instead of the id.

#### Cause
Newer Figma files expose `getTextStyleIdAsync()` as the canonical reader.
Older files still expose the sync `textStyleId` property. The presence of
the async method indicates which.

#### Correct pattern
Use `getTextStyleIdCompat(node)`. It checks for the async method first and
falls back to the sync property.

#### When this matters
Any read of style ids across mixed-age files.

### Setting `figma.currentPage` directly is unsupported

#### Symptom
A page-switch operation does nothing, or throws "currentPage is read-only".

#### Cause
`figma.currentPage = page` is not a supported assignment.

#### Correct pattern
`await figma.setCurrentPageAsync(page)`.

#### When this matters
Any script that navigates between pages before mutating.

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

## Verification

### The plugin API report claims success but the render is wrong

#### Symptom
The `use_figma` response says the operation succeeded, but the screenshot
shows a misaligned, overflowing, or unstyled result.

#### Cause
The API confirms the mutation ran, not that the visual outcome matches the
intent. Re-flows, font fallbacks, and binding losses all produce successful
API responses with wrong rendered output.

#### Correct pattern
Screenshot after the final mutation in a sequence via the read-side
`get_screenshot` MCP tool. Compare against the operation's intent. If
diverged, screenshot intermediate states to localise the failure.

#### When this matters
Every visual mutation. Especially after text changes inside auto-layout
parents.
