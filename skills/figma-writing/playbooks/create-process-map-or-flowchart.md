# Create process map or flow chart

## When to use
Use this when the user asks Claude to create a process map, flow chart, journey map, service blueprint, workflow diagram, or stakeholder-level process view in Figma.

This playbook is for write-side Figma creation. It does not replace domain understanding: first understand the process, then draw it.

## What Claude needs first
- The target Figma file and page or frame where the map should be created.
- The process content, or enough product/code context to infer a draft map.
- A reference frame when one exists. If the file contains an existing process map, treat that existing process map as the style source unless the user asks for a new style.
- The intended altitude: stakeholder overview, per-domain journey, operational swimlane, implementation flow, or another level.

## Pre-flight reads
- `references/pitfalls/text-and-fonts.md` for font loading and text mutation.
- `references/pitfalls/auto-layout.md` if placing inside auto-layout frames.
- `references/pitfalls/tables-charts-and-diagrams.md` for diagrams and process maps.
- `references/pitfalls/verification-and-collaboration.md` for screenshot verification.
- Helpers used when cloning text-bearing templates:
  - `cloneAndRebind`
  - `matchTextNodesByIndex`
  - `setTextPreservingBindings`

## Process model check
Before drawing, identify whether each relationship is sequential, parallel, repeated, conditional, or independent. Do not chain activities merely because they appear on the same screen, dashboard, or source file.

If this is unclear and it changes the map, ask one concise question before mutating Figma.

## Style-source rule
Prefer the host file style over a generic diagram style.

1. Search the target page or nearby pages for an existing process map, flow chart, journey map, or diagram.
2. If one exists, use it as the reference frame. Inspect the visual vocabulary before creating anything:
   - map container fill, stroke, radius, and padding;
   - title card structure, typography, and accent treatment;
   - action or screen nodes;
   - milestone nodes;
   - decision diamonds;
   - connector colour, weight, arrowhead shape, and routing;
   - legends, labels, dashed placeholders, swimlanes, and grouping boxes;
   - horizontal and vertical spacing.
3. Clone text-heavy or style-sensitive templates when that preserves custom fonts and spacing more reliably than rebuilding them.
4. Build simple shapes from extracted style values when cloning would create unnecessary structural baggage.

## Default go-to style
If no reference frame or user-provided style exists, use this as the go-to style for stakeholder process maps:

- Large rounded map container with a light neutral fill and subtle grey border.
- Title card with a blue header, short description, key decisions, and legend.
- White rounded action/screen nodes for ordinary steps.
- Pale green milestone nodes with green border for logged, completed, or important state changes.
- Pale pink diamond decision nodes with pink border for branch points.
- Grey orthogonal connectors with arrowheads.
- Dashed borders for prototype placeholders, future steps, or not-yet-built actions.
- Left-to-right flow, using lanes or branches when routines are parallel or independent.

Treat this as a starting point, not a brand identity. If the user or file provides a stronger style source, follow that instead.

## Figma construction pattern
1. Run a read-only probe first. Capture the reference frame ID, dimensions, node styles, text fonts, and any mixed-font text nodes.
2. Confirm required fonts are available with `figma.listAvailableFontsAsync()` when creating or mutating text.
3. Create or clone the map container and title card.
4. Create nodes and decision diamonds as separate objects. Polygon nodes cannot contain child text, so place decision labels as sibling text positioned over the diamond.
5. Draw connectors with design-safe primitives. If Connector nodes are unavailable or blocked, use rectangle or line shafts plus vector arrowheads.
6. Group related branches with dashed boxes only when it improves scanning.
7. Add labels to branches only where the decision would otherwise be ambiguous.
8. Keep placeholder or future actions visually distinct, usually with dashed borders and a legend note.

## Verification
1. Screenshot the final map, not just individual nodes.
2. Compare against the reference frame or default go-to style.
3. Read back geometry for section or frame bounds when screenshots show unexpected padding.
4. Check that connectors do not cross labels, diamonds, or node text.
5. Check that long labels fit inside their nodes and that parallel/repeating flows are not accidentally shown as one linear sequence.

## Common failures

- **Generic flowchart style appears in a styled file.** A reference frame was not inspected first. Re-run with the style-source rule.
- **Independent routines are chained into one sequence.** The process model was not checked. Re-map as parallel lanes, branches, or separate maps.
- **Decision labels disappear or move separately.** The diamond was treated like a container. Keep the label as a sibling and group it with the polygon.
- **Connector nodes fail to create.** Use rectangle or line shafts plus vector arrowheads.
- **Section screenshot looks padded or sparse.** Verify child bounds and absolute bounding boxes before resizing the section.
