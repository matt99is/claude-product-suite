# CLAUDE.md

`AGENTS.md` is the authoritative LLM context entry point for this project.

## Mandatory startup contract (do this before commands/search/edits)

<!-- Mirrors the Startup Gate in AGENTS.md - if you change one, change the other -->

Use progressive specialist loading. Read specialist `SKILL.md` files only when the task routes to them through the router or capability map.

1. Read `AGENTS.md`.
2. Read `README.md`.
3. Read `skills/product-suite-router/SKILL.md`.
4. Read `skills/product-suite-router/references/capability-map.md`.
5. Read vault project note: `../vault/Projects/claude-product-suite.md`.
6. Read vault governance note: `../vault/Patterns/vault-note-governance.md`.
7. In the first response, explicitly confirm these files were loaded.

For all remaining project rules, load and follow `AGENTS.md`.
