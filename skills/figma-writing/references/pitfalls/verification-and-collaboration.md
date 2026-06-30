# Verification and Collaboration Pitfalls

Use for screenshot verification, stale geometry, and collaborative editing risks.

Each entry uses the same four-part format: **Symptom**, **Cause**, **Correct pattern**, **When this matters**.

---

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
