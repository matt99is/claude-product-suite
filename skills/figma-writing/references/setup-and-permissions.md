# Figma Setup And Permissions

Use this reference whenever a user asks Claude to create, update, clone, or otherwise mutate Figma content.

The goal is to prevent a common setup failure: Claude can read Figma context, but cannot write to the canvas because it is using a read-only connection, an unauthenticated remote connection, or a Figma account without edit access.

## Terminology

- **Remote Figma MCP server**: Figma-hosted MCP endpoint used through Claude Code authentication. This is the required path for write-to-canvas work.
- **Desktop MCP server**: local Figma desktop app MCP connection. Desktop MCP is not the write path for this skill; if it is the only Figma connection available, stop and set up the remote server instead.
- **Plugin**: the Claude Code installation package that configures the Figma MCP server and includes Figma skills.
- **Skill**: reusable instructions for how to use available tools. Skills do not add MCP capabilities by themselves.
- **Write-to-canvas**: creating or modifying native editable Figma Design or FigJam content through remote, write-capable Figma MCP tools.

## Required Setup Path

Use only the remote Figma MCP server for write-side Figma work. Do not guide the user through personal access tokens, local desktop MCP setup, SSH tunnels, or `figma-desktop` MCP configuration for canvas writes.

For Claude Code, the supported setup path is:

```text
claude plugin install figma@claude-plugins-official
```

After installation:

1. Restart Claude Code.
2. Run `/plugin`.
3. Open the Installed tab.
4. Select the `figma` server/plugin entry.
5. Start the browser authorization flow.
6. Click Allow access in Figma.
7. Return to Claude Code and confirm the Figma server shows as connected.

This authorization flow is the auth method. Do not ask the user to create or paste a Figma personal access token for this skill.

## Write-Capable Requirement

For Figma writes, do not treat any Figma connection as sufficient. Confirm all of these before attempting mutation:

1. The remote Figma MCP server is connected through the official Claude Code Figma plugin.
2. The Figma plugin has completed browser authorization.
3. The authenticated Figma account can access the target file.
4. The authenticated Figma account has edit access to the target Figma Design or FigJam file.
5. The available tools include write-capable Figma operations, such as `use_figma`, not only context or metadata readers.

The Figma-provided `figma-use` skill is the foundational write-to-canvas workflow. It can guide creation of frames, components, variables, layouts, and editable canvas content when the required remote MCP tools and user permissions are available.

Skills do not add MCP capabilities. If only read/context tools are available, this `figma-writing` skill must stop and provide setup guidance instead of pretending it can edit the file.

## Preflight For Figma Edits

Before any write-side Figma operation:

1. Confirm the user wants mutation, not critique or read-only inspection.
2. Confirm the remote Figma MCP server is connected. In Claude Code, ask the user to check `/plugin` for the Figma plugin connection and `/mcp` for the active Figma server/tools if needed.
3. Confirm the user is authenticated to the Figma account that can access the file.
4. Confirm the user has edit access to the target Figma Design or FigJam file.
5. Confirm the target file URL or selection URL is available.
6. If using text operations, continue with the font-loading preflight in `skills/figma-writing/SKILL.md`.

## Read-Only Symptoms

If any of these appear, stop before writing and explain the likely setup issue:

- Claude can inspect frames, components, variables, or metadata but cannot create or update nodes.
- The available Figma tools look context-only or read-only.
- The only active Figma connection is desktop MCP, local MCP, Dev Mode MCP, or `figma-desktop`.
- The MCP server is disconnected, unauthenticated, or missing from `/mcp`.
- The Figma plugin is installed but not authorized in `/plugin`.
- The user can open the file but cannot edit it in Figma.
- The user is on a seat or file permission level that prevents writing to the target file.

## User-Facing Setup Guidance

When a user asks for Figma edits but write-capable tools are unavailable, answer with this short setup path:

1. Install the official Figma plugin for Claude Code:

   ```text
   claude plugin install figma@claude-plugins-official
   ```

2. Restart Claude Code.
3. Run `/plugin`, open Installed, choose the Figma server/plugin entry, and authorize Figma in the browser.
4. Run `/mcp` and confirm the Figma server is connected.
5. Open the target Figma file and confirm the authenticated account has edit access.
6. Retry the request with the Figma file URL or selection URL.

If the user is using desktop MCP, local MCP, Dev Mode MCP, a personal access token, or an SSH tunnel, explain that those are not the write-to-canvas setup for this skill. Keep the recovery path simple: install and authorize the official remote Figma plugin.

## Sources To Check When Guidance May Have Changed

- Figma Help: Claude Code and Figma: Set up the MCP server
- Figma Help: Guide to the Figma MCP server
- Figma Help: Figma MCP collection: How to set up the Figma remote MCP server
- Figma Help: Figma skills for MCP
