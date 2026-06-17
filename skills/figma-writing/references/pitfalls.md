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

### Mixed-font text requires segment font loading

#### Symptom
Setting `node.characters` throws even though the text node appears to use a
loadable font, or a title-card body with bold headings and regular copy fails
mid-script.

#### Cause
The text node `fontName` is `figma.mixed`. Loading only `node.fontName` is
impossible because there is no single concrete font to load. Each styled text
segment must have its concrete font loaded first.

#### Correct pattern
Use `loadFontsForTextNode(node)` or `setTextPreservingBindings(node, text)`.
The helper loads every unique styled segment font and returns a warning so the
final screenshot can be checked for styled-range drift. Do not silently collapse
mixed-font text to one style unless the user explicitly wants that.

#### When this matters
Title cards, rich descriptions, labels with bold prefixes, and any cloned
documentation-style text block.

### Mixed-font source nodes can be poor templates

#### Symptom
A cloned text-heavy source looks right at first, but retexting it fails or
collapses styling because the source text uses mixed fonts.

#### Cause
When `node.fontName === figma.mixed`, the node does not have one concrete font
that can be loaded and reused safely. Treating it as a simple font source hides
per-segment styling that may be hard to preserve.

#### Correct pattern
Check for `figma.mixed` before using a node as a font source. For rich text, use
`loadFontsForTextNode` and verify styled ranges after mutation. If the desired
output is plain text, creating fresh text with explicitly loaded fonts can be
more reliable than cloning and retexting a mixed-font source.

#### When this matters
Existing documentation cards, rich table cells, and source nodes with bold
prefixes, links, or mixed emphasis.

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

### Resizing the primary axis disables hug behavior

#### Symptom
An auto-layout frame that was supposed to hug its children collapses or stays at
a tiny fixed size after new children are inserted.

#### Cause
Calling `resize()` on the primary axis after setting
`primaryAxisSizingMode = "AUTO"` can silently flip the primary axis back to
fixed sizing. For example, setting a vertical frame to AUTO and then calling
`resize(width, 10)` can leave the height fixed at 10.

#### Correct pattern
Set the counter-axis size first with `resize()` or
`layoutSizingHorizontal = "FILL"`, append or insert all children, then set
`primaryAxisSizingMode = "AUTO"` last. Never resize the primary dimension after setting it to AUTO.

#### When this matters
Any generated card stack, list, table-like layout, or section that relies on
auto-layout hug sizing after children are added.

### FILL children can prevent hug sizing

#### Symptom
A frame that should hug its contents becomes fixed, expands unexpectedly, or refuses to shrink after children are inserted.

#### Cause
Auto-layout sizing depends on both parent and child settings. A child set to `FILL` on an axis can make the parent need an explicit size on that axis; a parent cannot always infer a hug size from fill-sized children.

#### Correct pattern
Set the parent sizing intent first, then assign child sizing deliberately. Use HUG for content-sized children, FILL for children that should stretch inside a known parent size, and FIXED only when the design-system pattern calls for a stable dimension. Re-read geometry after layout settles.

#### When this matters
Cards, rows, toolbars, tables, chart containers, dashboards, and generated responsive frames.

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

### Text appears not to wrap because the container is too wide

#### Symptom
Body copy sits on one long line even though text wrapping appears enabled.

#### Cause
The parent card or text container is much wider than expected, so the text has
no reason to wrap. This can look like a `textAutoResize` problem when the real
issue is a too-wide container.

#### Correct pattern
Before touching `textAutoResize`, inspect the container width and take a
screenshot. Fix the parent/card width first. Only change `textAutoResize` after
you can explain why width constraints are not the cause.

#### When this matters
Generated cards, research summary boards, table-like layouts, and any long body
copy inserted into newly-created frames.

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

### Optional API property access can throw

#### Symptom
A guard such as `typeof node.getTextStyleIdAsync === function` throws before
the fallback path can run.

#### Cause
Some proxy-backed Figma nodes throw when optional properties are accessed, not
only when missing methods are called.

#### Correct pattern
Use `getTextStyleIdCompat(node)`. It wraps optional async method access in
`try` / `catch`, falls back to sync `textStyleId`, and returns an empty string if neither
reader is available.

#### When this matters
Any helper or script that checks newer optional API fields before falling back
to older sync properties.

### Setting `figma.currentPage` directly is unsupported

#### Symptom
A page-switch operation does nothing, or throws "currentPage is read-only".

#### Cause
`figma.currentPage = page` is not a supported assignment.

#### Correct pattern
`await figma.setCurrentPageAsync(page)`.

#### When this matters
Any script that navigates between pages before mutating.

### Prefer async node lookup in dynamic files

#### Symptom
`figma.getNodeById(id)` returns `null`, but the node exists and can be found
with an async lookup.

#### Cause
Some newer or dynamic files resolve nodes through async APIs more reliably than
the older synchronous getter.

#### Correct pattern
Use `await figma.getNodeByIdAsync(id)` by default when resolving known node IDs.
Fall back to sync lookup only when the async getter is unavailable.

#### When this matters
Any script that targets nodes by ID from a supplied Figma URL, selection URL, or
prior probe.

---

## Targeting and placement

### New frame created on the wrong page

#### Symptom
The script reports that a frame was created successfully, but the user cannot see it on the page linked in their Figma URL. A later probe finds the frame on a cover, hidden, or previously-current page.

#### Cause
The script appended new work to `figma.currentPage`. In MCP sessions, `figma.currentPage` can differ from the page implied by the URL or the page the user has open.

#### Correct pattern
When the user supplies a target node or page URL, extract the node ID, resolve it with `await figma.getNodeByIdAsync(nodeId)`, walk to the containing page, call `await figma.setCurrentPageAsync(page)`, and parent or place new work on that resolved page. Do not append new work to `figma.currentPage` unless no target node or page was supplied. Verify the new frame parent page after mutation.

#### When this matters
Any generated frame, component, table, chart, diagram, or mockup created from a Figma URL with `node-id`.

## Design-system discovery

### Library assets are not enabled in the file

#### Symptom
A script cannot find expected components, styles, variables, or chart/table kits even though the organisation has a design system.

#### Cause
Figma libraries must be enabled for a specific file before their assets are available through normal design work. Local style APIs also expose local styles, not a complete inventory of every team library asset.

#### Correct pattern
First search the current file for existing instances, styles, variables, and reference frames. If expected assets are missing, tell the user the library may not be enabled and ask for an enabled library, reference frame, component instance, or explicit component/variable key. Do not recreate a design-system component from generic rectangles merely because discovery returned nothing.

#### When this matters
Any design-system-safe frame, component, table, chart, graph, or dashboard build.

### Design-system component rebuilt from primitives

#### Symptom
The generated UI looks plausible but does not update with the design system, lacks component properties, or behaves differently from real product UI.

#### Cause
Claude copied the visual appearance of a button, card, field, table, or chart pattern instead of importing, cloning, or instancing the real design-system component.

#### Correct pattern
Prefer existing component instances, component sets, Code Connect mappings, and imported library components. Choose by semantic role first and visual resemblance second. Detach or rebuild only when the user explicitly needs a bespoke artefact or no system-backed source exists.

#### When this matters
Any production-looking UI, component exploration, or design-system-backed artefact.

### Resolved design-system values copied without bindings

#### Symptom
A generated frame, rectangle, table cell, chart primitive, or text node looks correct and uses the right colour or font, but inspecting it shows no linked text style, paint style, stroke style, or variable binding.

#### Cause
Claude matched the design system by resolved values instead of applying the source style or variable. The rendered result is visually close, but it will not follow future design-system updates or theme/mode changes.

#### Correct pattern
For every newly-created non-component node, prefer a real binding over a copied value. Apply text styles or typography variables for text, paint styles or `figma.variables.setBoundVariableForPaint` for fills and strokes, and `setBoundVariable` for supported numeric fields such as spacing, radius, sizing, opacity, and effects. After creation, read back `textStyleId`, `fillStyleId`, `strokeStyleId`, and `boundVariables`; report any node that only has copied resolved values as drift.

#### When this matters
Any generated non-component frame, text node, table, chart, graph, card, section, or email mockup that is expected to stay linked to the design system.

### Raw black or neutral colours are used without bindings

#### Symptom
Text, surfaces, dividers, or borders look correct but use raw `#000000`, `#FFFFFF`, or grey values with no `fillStyleId`, `strokeStyleId`, or paint variable binding. Text nodes may still have a valid `textStyleId`, which can hide the colour drift.

#### Cause
Claude treated black, white, surface, border, or neutral colours as harmless defaults, or stopped after binding typography. In many systems the semantic text or surface token is easier to find by inspecting a real component than by searching library names.

#### Correct pattern
For production or system-backed work, treat neutral colours as semantic tokens. Search variables and paint styles for text, ink, neutral, black, white, surface, border, divider, disabled, and background names. If search is inconclusive, inspect exemplar components with default text, cards, dividers, inputs, tables, or headers and reuse their bound fills, strokes, padding, radius, and spacing. Text style binding and colour binding are separate; verify both before claiming design-system compliance. If no binding exists, report the literal value as drift.

#### When this matters
Any production UI, email mockup, dashboard, table, chart, or component-like frame that creates non-component text, card, surface, divider, or border nodes.

### Embedded asset colours are mistaken for design-system drift

#### Symptom
A binding audit flags raw colours inside a preserved logo, illustration, icon, image fill, or external brand asset even though Claude did not create or restyle that artwork.

#### Cause
The audit treated every raw paint equally. Brand artwork and imported assets often contain embedded fills that are controlled by the source asset or component, not by the surrounding product design tokens.

#### Correct pattern
Separate asset artwork from authored UI. Do not count raw fills inside preserved component instances, logos, illustrations, icon artwork, or image fills as design-system drift. Report them separately as embedded asset colours only when useful. Keep the strict audit on Claude-created nodes, detached containers, wrapper frames, surfaces, dividers, borders, and any text or shape styling Claude changed.

#### When this matters
Production email mockups, branded headers, app-store badges, partner logos, product imagery, icon artwork, and any design that combines product UI with imported brand assets.

### Variable-bound paints are replaced by literal colours

#### Symptom
A layer keeps the right colour in the immediate screenshot but no longer follows theme, mode, or library updates.

#### Cause
The script assigned literal RGB fills or strokes to a node whose original paint was bound to a variable.

#### Correct pattern
Capture existing bound variables before mutation. When choosing new colours, bind variables where possible. For paint variables, mutate a copied paint object and bind the variable to that paint before assigning the fill or stroke array. Use literal colours only when no suitable variable exists or the user approves breaking the binding.

#### When this matters
Files using variables for brand, theme, semantic colour, spacing, radius, or typography.

## Style-matched node creation

### New nodes ignore the existing file style

#### Symptom
A newly-created Figma artefact is structurally correct but looks generic,
off-brand, or disconnected from nearby work.

#### Cause
The script created nodes from generic defaults instead of inspecting a nearby
reference frame, sibling group, or existing pattern first.

#### Correct pattern
Use `build-nodes-matching-existing-style.md`. Run a read-only style probe
before mutation, clone text-heavy templates when fonts or spacing matter, and
build simple shapes from extracted fills, strokes, radii, typography, and
layout values when cloning would carry too much structure.

#### When this matters
Any net-new card, table, annotation, content block, lightweight wireframe,
diagram element, or supporting artefact that should belong in the existing
Figma file.

### Cross-file clone is not a style transfer strategy

#### Symptom
A script tries to clone a node from another Figma file to reuse its style, but
the clone operation fails or the source node is unavailable.

#### Cause
Native `clone()` works on nodes in the current file context. A node from another
file is not a direct clone source for the active canvas.

#### Correct pattern
Prefer an in-file clone source. For cross-file style matching, probe the source
file's tokens, styles, geometry, and typography, then rebuild the target in the
destination file from those values.

#### When this matters
Any request to match a style from a different Figma file, library sample, or
external reference frame.


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

## Concurrent editing

### Re-read geometry before destructive resize or move

#### Symptom
Claude resizes or moves a frame and accidentally clobbers a user's manual edit
made during the same session.

#### Cause
Figma files are collaborative. Geometry read earlier in the script or a prior
turn may be stale by the time a destructive resize or move runs. In
`layoutMode: "NONE"` frames, children can visually overflow without causing the
frame to auto-grow, so remembered dimensions are especially risky.

#### Correct pattern
Re-read current geometry immediately before any destructive resize or move.
Prefer fitting the frame to measured child/content bounds over restoring a
remembered width or height. If the user is actively editing the same area, tell
them before applying broad layout changes.

#### When this matters
Any shared live editing session, especially when changing parent frame bounds,
resizing non-auto-layout frames, or fitting generated content.

---

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

### Returned geometry can be stale

#### Symptom
The `use_figma` return object reports stale geometry such as a height, width,
or bounding box that does not match the canvas after reflow.

#### Cause
The script response can reflect an intermediate state or pre-reflow geometry.
The render and a fresh probe are more reliable than the original return value.

#### Correct pattern
Never trust dimensions in the script return object as confirmation. Use a
screenshot or a fresh readback call after the final property set before
debugging layout.

#### When this matters
Any generated layout whose size depends on auto-layout, text wrapping, table
rows, or children inserted during the same script.

### Screenshot bounds can be transiently wrong

#### Symptom
`get_screenshot` returns a 1x1 image, a pre-reflow width, or otherwise
degenerate bounds even though the canvas looks plausible.

#### Cause
The screenshot tool may capture before layout bounds settle or may receive
stale bounds metadata.

#### Correct pattern
If screenshot dimensions look wrong, re-request once before debugging the
layout. If the second screenshot is still wrong, then inspect frame bounds and
child absolute bounding boxes.

#### When this matters
Any verification step where the screenshot dimensions themselves look suspect.
