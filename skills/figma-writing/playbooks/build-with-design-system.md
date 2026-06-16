# Build with a design system

## When to use
Use this when the user asks Claude to create or update Figma frames, UI sections, components, tables, charts, graphs, dashboards, or production-looking artefacts that should use an existing design system.

This playbook extends style-matched node creation. It is stricter: do not merely make something look close. Discover and reuse the file's real components, variables, styles, modes, typography, spacing, and auto-layout conventions before creating anything new.

For process maps, flow charts, journey maps, service blueprints, workflow diagrams, or stakeholder process views, use `create-process-map-or-flowchart.md` first, then apply this playbook only for design-system-specific components or data-display styling.

## What Claude needs first
- The target Figma file and page, frame, section, or node URL.
- The requested artefact: frame, component, table, chart, graph, dashboard, or data-display block.
- The content or data to render, including labels, values, units, states, and any required source note.
- A design-system source: enabled library, existing in-file component instances, nearby reference frame, component set, Code Connect mapping, or explicit component or variable keys.
- The intended fidelity: working draft, stakeholder-ready artefact, production UI frame, or component exploration.

## Pre-flight reads
- `references/pitfalls.md` sections:
  - Fonts
  - Design-system bindings
  - Design-system discovery
  - Auto-layout
  - Native or plugin-created tables, for tables
  - Charts and graphs, for charts or graphs
  - Verification
- Helpers used when cloning or mutating text-bearing nodes:
  - `cloneAndRebind`
  - `matchTextNodesByIndex`
  - `setTextPreservingBindings`

## Target page and placement rule
When the supplied Figma URL contains a node ID, treat that node as the placement anchor unless the user says otherwise.

1. Extract the node ID from the URL and resolve it with `await figma.getNodeByIdAsync(nodeId)`.
2. Walk up the parent chain to find the containing `PAGE` node, then call `await figma.setCurrentPageAsync(page)`.
3. Place new work on that resolved page, preferably near the target node or inside the target parent if the request implies insertion.
4. Do not append new work to `figma.currentPage` when a target node or page URL exists. The MCP current page can point at a cover or hidden page that is not the page the user has open.
5. After mutation, verify the new frame parent page name and ID in the return payload or a readback probe. Wrong-page placement is a failure even if the mockup itself renders correctly.

## Design-system discovery rule
Do not start from generic colours or fonts when a design-system source exists.

1. Search the target subtree and nearby pages for existing instances, component-like patterns, local styles, variables, and reference frames.
2. If Code Connect or component mapping tools are available, use them to identify the intended code-backed component names and prop patterns before recreating UI from primitives.
3. Capture components, variables, styles, and modes before mutation:
   - component and component-set names, variants, exposed properties, and instance overrides;
   - colour, typography, spacing, radius, stroke, effect, and grid variables;
   - local paint, text, effect, and grid styles;
   - active mode names and resolved values for the target context;
   - auto-layout direction, gap, padding, alignment, min or max dimensions, and layout sizing.
4. Prefer importing or cloning existing design-system components over rebuilding their visual shape from rectangles and text.
5. Prefer bind variables or style IDs over literal values. Literal values are acceptable only when no matching variable or style exists, or when the user explicitly asks for an exploratory draft outside the system.
6. If the expected library assets are not visible, tell the user the library may not be enabled in the file and ask for a reference frame, enabled library, or explicit component/variable key.

## Component selection pattern
1. Map the requested UI to available design-system parts: buttons, fields, tabs, cards, table rows, chart containers, badges, icons, empty states, and navigation.
2. Choose the closest component by semantics first, visual similarity second. A warning banner component is a better source for a warning state than a visually similar generic card.
3. Use component properties and variants for state, size, emphasis, icon presence, and density when they exist.
4. Preserve instance bindings and overrides. Avoid detaching instances unless the user explicitly needs a bespoke component or the component cannot express the requested content.
5. When creating a reusable component or variant set, use the file's variable system and naming conventions rather than inventing new token names.

## Token and variable pattern
1. Resolve the target mode before choosing tokens. Light, dark, brand, density, or theme modes can change the correct value.
2. Bind variables for paints, text fields, spacing, radius, and component properties whenever supported by the node and variable type.
3. For paint variables, mutate a copied paint object and bind the variable to that paint before assigning the new fills or strokes. Do not replace a token-bound paint with a plain RGB object unless the user approves breaking the binding.
4. For typography, prefer the file's text styles or typography variables. Verify font availability with `figma.listAvailableFontsAsync()` before creating or mutating text.
5. If token names are ambiguous, choose the most specific semantic token available, such as action, surface, border, danger, success, warning, or text-secondary, instead of the closest raw colour.

## Non-component binding pattern
Newly-created non-component nodes must be linked back to the design system when matching tokens exist. Matching the correct fonts and colours is not design-system compliance. This applies to frames, rectangles, text nodes, table cells, chart primitives, and other nodes that are not component instances.

1. For text, apply the closest text style or typography variables after loading the required font. Do not stop at setting `fontName`, `fontSize`, or literal fills.
2. For fills and strokes, prefer paint styles or paint variables over copied RGB values. For variable paints, mutate a copied paint object and use `figma.variables.setBoundVariableForPaint` before assigning the fill or stroke array.
3. For spacing, radius, sizing, opacity, effects, and component properties, bind matching variables with `setBoundVariable` where the node supports that field.
4. If only a resolved value can be found, create the node with that value but report it as drift rather than claiming the node uses the design system.
5. After building, read back non-component nodes and report whether `textStyleId, fillStyleId, strokeStyleId, or boundVariables` are present. A screenshot proves visual match only; it does not prove design-system linkage.

## Auto-layout sizing recipes
Use HUG, FILL, and FIXED intentionally.

- Outer screen or artboard: usually FIXED width and height unless the user wants a component or responsive section.
- Page section inside a screen: vertical auto layout, FILL width, HUG height, stable padding and gap.
- Card or panel in a column: vertical auto layout, FILL width, HUG height, with min or max width only when the surrounding layout needs it.
- Toolbar, row, or compact control group: horizontal auto layout, HUG height, FILL width when it spans a container, HUG width when it should size to controls.
- Text inside fluid cards: FILL width with wrapping only when the parent width is constrained. Do not change `textAutoResize` unless the reason is explicit.
- Responsive card matrix or dashboard tiles: use grid auto layout when the file or target pattern already uses grid; otherwise use nested horizontal and vertical auto-layout frames.

Set counter-axis constraints before relying on hug behavior. Avoid resizing a primary axis after setting it to hug or auto sizing.

## Tables
First decide whether the target surface is FigJam, an existing native or plugin-created table, or a Figma Design file.

- In FigJam, native table APIs may be available; inspect the node and use `TableNode`, `TableCellNode`, `cellAt`, `insertRow`, `insertColumn`, and row or column resize APIs only after confirming the API shape.
- In Figma Design files, do not promise native table creation from scratch. Prefer an existing table component, existing table-like frame, or an editable auto-layout or grid structure.
- Preserve table semantics visually: header, rows, columns, cell padding, alignment, dividers, zebra or state treatment, selected or hover states, empty state, and source or timestamp note where relevant.
- Apply per-column text alignment and number formatting. Right-align numeric measures when that matches the design-system pattern.
- Insert multiple rows bottom-up or recalculate indices after every insertion. Identify target rows by visible content markers, not remembered row numbers.

## Charts and graphs
Charts must start from data and the design system, not decoration.

1. Confirm the chart type, data values, units, time period, comparison baseline, and target insight before drawing.
2. Prefer an existing chart kit, component set, or library pattern when present. If none exists, create editable primitives that follow the file's tokens and typography.
3. Include the basics expected in product-team artefacts: title, subtitle or insight, axes or scale, labels, legend, source note, empty/loading/error state when relevant, and direct annotation for the key value.
4. Do not use colour alone to distinguish series or meaning.
5. Keep chart geometry truthful. Use a consistent scale, keep zero baselines for bars unless clearly labelled otherwise, and avoid decorative 3D or perspective effects.
6. For dashboards, prefer tables, bar charts, line charts, and simple KPI cards unless the user explicitly asks for a more specialised visualisation.
7. If data is incomplete, create a clearly labelled placeholder state rather than inventing values.

## Verification
1. Screenshot the final parent frame or component set, not only the changed node, and confirm it is on the resolved target page when the user supplied a node or page URL.
2. Compare the output against the source components, variables, styles, modes, and reference frame.
3. Read back selected nodes for component IDs, style IDs, bound variables, layout sizing, and dimensions when the screenshot cannot prove bindings survived. For non-component nodes, explicitly verify `textStyleId, fillStyleId, strokeStyleId, or boundVariables` rather than trusting matched resolved values.
4. Check long labels, table overflow, chart labels, legends, empty states, and mobile or narrow-frame resizing when applicable.
5. Surface any drift: missing libraries, unavailable fonts, ambiguous tokens, unbound literal values, detached instances, or layout sizing compromises.

## Common failures

- **Looks right but is not system-backed.** The output used copied colours and fonts instead of imported components, styles, or variables. Matching the correct fonts and colours is not design-system compliance. Rebuild using actual components and bind variables where possible. For non-component nodes, verify `textStyleId`, `fillStyleId`, `strokeStyleId`, or `boundVariables` before saying the build is design-system-safe.
- **Wrong page.** The output was created on `figma.currentPage` instead of the page implied by the supplied target node or page URL. Move it to the resolved target page, then update the skill memory or user-facing note if needed.
- **Wrong theme or mode.** Tokens were chosen from resolved colour values without checking the active variable mode. Re-probe variables and mode context.
- **Rigid layout breaks when content changes.** The frame used fixed widths or heights where HUG or FILL was expected. Rebuild the hierarchy with explicit auto-layout sizing recipes.
- **Table edits lose column styling.** New rows copied only row-level styling. Capture and reapply each column's cell treatment.
- **Chart is pretty but misleading.** The visual lacks scale, labels, source, or truthful geometry. Return to the data contract before styling.

## Sources that informed this playbook
- Figma MCP Server design context, write-to-canvas, and file-structure guidance: https://developers.figma.com/docs/figma-mcp-server/
- Figma MCP Server write-to-canvas guidance: https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/
- Figma MCP Server file-structure guidance: https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/
- Figma Code Connect guidance for code-backed component usage: https://developers.figma.com/docs/code-connect/
- Figma Plugin API variables guidance: https://developers.figma.com/docs/plugins/working-with-variables/
- Figma Plugin API team library guidance: https://developers.figma.com/docs/plugins/api/figma-teamlibrary/
- Figma Plugin API table node guidance: https://developers.figma.com/docs/plugins/api/TableNode/
- Figma Help Center library enablement guidance: https://help.figma.com/hc/en-us/articles/1500008731201-Add-or-remove-a-library-from-a-design-file
- Figma Help Center variables guidance: https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma
- Figma Help Center auto-layout guidance: https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout
- Carbon Design System data-visualization guidance: https://carbondesignsystem.com/data-visualization/getting-started/
