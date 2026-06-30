# Figma Writing Pitfalls Index

This is a progressive-disclosure index for write-side Figma failure modes. Read only the topic file that matches the current playbook or observed issue. Add new entries via `/figma-learn`, then place them in the smallest relevant topic file.

Each topic file keeps the same four-part pitfall format: **Symptom**, **Cause**, **Correct pattern**, **When this matters**.

## Topic Files

- `pitfalls/text-and-fonts.md` - Use for font loading, text mutation, wrapping, and arc-rendering issues. Covers: Fonts, Text wrapping, Progress arcs.
- `pitfalls/auto-layout.md` - Use for auto-layout flow, sizing, insertion order, and wrong-page placement issues. Covers: Auto-layout, Targeting and placement.
- `pitfalls/api-quirks.md` - Use for Figma plugin API compatibility and lookup quirks. Covers: API quirks.
- `pitfalls/style-matching-and-bindings.md` - Use for design-system discovery, variable/style binding, and matching existing file style. Covers: Design-system bindings, Design-system discovery, Style-matched node creation.
- `pitfalls/tables-charts-and-diagrams.md` - Use for table editing, process maps, flow charts, charts, and graphs. Covers: Native or plugin-created tables, Diagrams and process maps, Charts and graphs.
- `pitfalls/verification-and-collaboration.md` - Use for screenshot verification, stale geometry, and collaborative editing risks. Covers: Concurrent editing, Verification.

## Quick Routing

- Font loading, mixed text, text wrapping, or arcs -> `pitfalls/text-and-fonts.md`.
- Auto-layout sizing, insertion order, or wrong-page placement -> `pitfalls/auto-layout.md`.
- Async getters, optional property access, page switching, or node lookup -> `pitfalls/api-quirks.md`.
- Design-system discovery, variables, bindings, or style-matched creation -> `pitfalls/style-matching-and-bindings.md`.
- Tables, charts, graphs, process maps, or flow charts -> `pitfalls/tables-charts-and-diagrams.md`.
- Screenshot verification, stale geometry, or concurrent editing -> `pitfalls/verification-and-collaboration.md`.
