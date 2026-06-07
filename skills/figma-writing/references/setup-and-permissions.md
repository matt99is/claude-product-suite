# Figma Setup And Permissions

Use this reference whenever a user asks Claude to create, update, clone, or otherwise mutate Figma content.

The goal is to avoid a common failure mode: Claude can sometimes read Figma context but cannot write to the canvas because the active Figma integration, authentication state, or file permission is not write-capable.

## Terminology

- **MCP server**: the connection that exposes Figma tools to the agent. The tools determine what Claude can actually do.
- **Plugin**: the installation package in a client such as Claude Code. Installing a plugin may configure an MCP server and include skills.
- **Skill**: reusable instructions for how to use available tools. Skills do not add MCP capabilities by themselves.
- **Write-to-canvas**: creating or modifying native editable Figma Design or FigJam content through write-capable Figma MCP tools.

## Official Figma Setup Paths

Figma documents two MCP server paths for agentic clients:

1. **Remote Figma MCP server**: recommended for most users and the broadest feature set. For Claude Code, Figma documents installing the Figma plugin with:

   ```text
   claude plugin install figma@claude-plugins-official
   ```

   After installation, restart Claude Code, open `/plugin`, go to Installed, authorize Figma, and confirm the Figma server is connected.

2. **Desktop Figma MCP server**: a local server exposed from the Figma desktop app for specific organization and enterprise use cases. Figma generally recommends the remote server for most users. The desktop server is commonly configured in Claude Code with an HTTP MCP server such as:

   ```text
   claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
   ```

   Users must enable the MCP server inside the Figma desktop app and confirm it appears connected in `/mcp`.

## Write-Capable Requirement

For Figma writes, do not treat any Figma connection as sufficient. Confirm that the active environment exposes write-capable Figma MCP tools before attempting mutation.

The Figma-provided `figma-use` skill is the foundational write-to-canvas workflow. It can guide creation of frames, components, variables, layouts, and editable canvas content when the required MCP tools and user permissions are available.

Skills do not add MCP capabilities. If only read/context tools are available, this `figma-writing` skill must stop and provide setup guidance instead of pretending it can edit the file.

## Preflight For Figma Edits

Before any write-side Figma operation:

1. Confirm the user wants mutation, not critique or read-only inspection.
2. Confirm a write-capable Figma MCP server is connected. In Claude Code, ask the user to check `/plugin` for the Figma plugin connection and `/mcp` for the active Figma server/tools if needed.
3. Prefer the remote Figma MCP server for most users unless the user has an organization-specific reason to use the desktop server.
4. Confirm the user is authenticated to the Figma account that can access the file.
5. Confirm the user has edit access to the target Figma Design or FigJam file.
6. Confirm the target file URL or selection URL is available.
7. If using text operations, continue with the font-loading preflight in `skills/figma-writing/SKILL.md`.

## Read-Only Symptoms

If any of these appear, stop before writing and explain the likely setup issue:

- Claude can inspect frames, components, variables, or metadata but cannot create or update nodes.
- The available Figma tools look context-only or read-only.
- The user can open the file but cannot edit it in Figma.
- The MCP server is disconnected, unauthenticated, or missing from `/mcp`.
- The Figma plugin is installed but not authorized in `/plugin`.
- The user is on a seat or file permission level that prevents writing to the target file.

## User-Facing Setup Guidance

When a user asks for Figma edits but write-capable tools are unavailable, answer with a short setup path:

1. Install the Figma plugin for Claude Code:

   ```text
   claude plugin install figma@claude-plugins-official
   ```

2. Restart Claude Code.
3. Run `/plugin`, open Installed, choose the Figma plugin/server, and authorize Figma.
4. Run `/mcp` and confirm the Figma server is connected.
5. Open the target Figma file and confirm the authenticated account has edit access.
6. Retry the request with the Figma file URL or selection URL.

If the user is using the desktop MCP server, tell them Figma recommends the remote Figma MCP server for most users. Use desktop setup only when their organization or environment requires it.

## Sources To Check When Guidance May Have Changed

- Figma Help: Claude Code and Figma: Set up the MCP server
- Figma Help: Guide to the Figma MCP server
- Figma Help: Figma skills for MCP
