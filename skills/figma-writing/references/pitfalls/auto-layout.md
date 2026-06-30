# Auto-layout and Placement Pitfalls

Use for auto-layout flow, sizing, insertion order, and wrong-page placement issues.

Each entry uses the same four-part format: **Symptom**, **Cause**, **Correct pattern**, **When this matters**.

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
