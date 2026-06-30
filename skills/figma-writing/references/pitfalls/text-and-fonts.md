# Text and Fonts Pitfalls

Use for font loading, text mutation, wrapping, and arc-rendering issues.

Each entry uses the same four-part format: **Symptom**, **Cause**, **Correct pattern**, **When this matters**.

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
