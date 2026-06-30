# Style Matching and Bindings Pitfalls

Use for design-system discovery, variable/style binding, and matching existing file style.

Each entry uses the same four-part format: **Symptom**, **Cause**, **Correct pattern**, **When this matters**.

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

---

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

---

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
