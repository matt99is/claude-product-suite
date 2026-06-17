# Build nodes matching existing style

## When to use
Use this when the user asks Claude to create new Figma content that should look
like it belongs in an existing file, but no narrower playbook fits. Examples:
custom cards, tables, diagram elements, content blocks, lightweight wireframe
sections, labels, annotations, or small supporting artefacts.

For process maps, flow charts, journey maps, service blueprints, workflow
diagrams, or stakeholder process views, use
`create-process-map-or-flowchart.md` instead. That playbook includes the
diagram-specific process model and connector guidance.

## What Claude needs first
- The target Figma file and page or parent frame.
- The content to create, or enough source context to draft it.
- A style source: a reference frame, nearby sibling nodes, or an existing
  component-like pattern in the file.
- The intended level of fidelity: rough working artefact, stakeholder-ready
  map, production UI, or design-system component exploration.

## Pre-flight reads
- `references/pitfalls.md` sections:
  - Fonts
  - Design-system bindings, if cloning or mutating styled text
  - Auto-layout, if inserting into auto-layout frames
  - Style-matched node creation
  - Verification
- Helpers used when cloning or mutating text-bearing nodes:
  - `cloneAndRebind`
  - `matchTextNodesByIndex`
  - `setTextPreservingBindings`

## Style-source rule
Do not start from generic UI defaults when a file-specific style source exists. For a lightweight wireframe, rough concept, or ideation frame, keep the probe proportional: capture enough style to make the artefact readable and coherent. Do not run a production-level token audit unless the user explicitly asks for production-ready or system-backed output.

1. Find the closest useful reference frame, sibling group, or existing pattern.
2. Run a read-only probe before mutation. Capture:
   - fills, strokes, effects, corner radii, opacity, and stroke weights;
   - text font family, style, size, line height, letter spacing, and fills;
   - auto-layout mode, padding, gaps, constraints, and sizing behavior;
   - icon or shape conventions;
   - spacing rhythm and alignment rules;
   - placeholder, disabled, selected, warning, or milestone treatments.
3. Prefer to clone text-heavy or style-sensitive templates so custom fonts,
   spacing, and bindings come along for the ride.
4. Prefer creating simple shapes from extracted fills, strokes, radii, typography, and spacing values when cloning would bring
   unnecessary children, bindings, or layout baggage.

## Construction pattern
1. Identify whether the target parent is auto-layout. If it is, plan insert
   index and flow position before creating nodes.
2. Confirm required fonts with `figma.listAvailableFontsAsync()` when creating
   or mutating text.
3. Build small units first: container, title or label, body text, supporting
   shapes, icon placeholders, or connector primitives.
4. Use `setTextPreservingBindings` for cloned text. It loads all needed fonts,
   including mixed-font text segments, and returns warnings for visual review.
5. Keep names meaningful enough for later inspection, especially for repeated
   nodes.
6. Avoid broad component or token changes unless the user explicitly asked for
   design-system work.

## Verification
1. Screenshot the final parent frame, not only the new node.
2. Compare the new work against the reference frame or nearby source nodes.
3. Read back geometry when screenshots are ambiguous.
4. Check long labels, mixed-font text, auto-layout reflow, and alignment.
5. Surface any warnings about mixed fonts, missing variables, or fallback
   behavior to the user.

## Common failures

- **New content looks generic.** No reference node was inspected. Re-run with a
  style-source probe.
- **Clone carries unwanted structure.** The source was too heavy for the job.
  Rebuild simple shapes from extracted style values.
- **Text styling drifts after replacement.** Fonts or styled text segments were
  not loaded before setting characters, or the screenshot was skipped.
- **Auto-layout moves the node.** An explicit insert index or intended flow
  position was missing.
