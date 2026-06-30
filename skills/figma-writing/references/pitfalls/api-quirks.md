# API Quirks Pitfalls

Use for Figma plugin API compatibility and lookup quirks.

Each entry uses the same four-part format: **Symptom**, **Cause**, **Correct pattern**, **When this matters**.

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
