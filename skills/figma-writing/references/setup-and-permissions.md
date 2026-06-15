# Figma Setup And Permissions

Use this reference whenever a user asks Claude to create, update, clone, or otherwise mutate Figma content, or when a Figma write attempt fails.

The goal is to avoid two opposite failure modes: sending setup instructions to users whose write tools already work, and pretending a read-only or unsupported Claude surface can edit Figma.

## Operating Rule

Do not start with a setup wizard. If write-capable tools are visible and the user supplied a target Figma file or selection URL, attempt the requested edit first. If the user only asks to verify access, perform a minimal low-risk write probe only with their approval, then verify with screenshot or readback.

Only switch to setup or troubleshooting when write-capable tools are missing, the target file is missing, or the write attempt fails.

## Terminology

- **Remote Figma MCP server**: Figma-hosted MCP endpoint. This is the required path for write-to-canvas work.
- **Desktop MCP server**: local Figma desktop app MCP connection. Desktop MCP is not the write path for this skill; if it is the only Figma connection available, stop and set up a remote write-capable surface instead.
- **Skill**: reusable instructions for how to use available tools. Skills do not add MCP capabilities by themselves.
- **Write-to-canvas**: creating or modifying native editable Figma Design or FigJam content through remote, write-capable Figma MCP tools.

## First Decision

Before giving setup advice:

1. Check whether this Claude session exposes write-capable Figma tools such as `use_figma`.
2. If write-capable tools are available, use the target file or selection URL and attempt the requested write.
3. Verify the result with screenshot or readback.
4. If the write attempt fails, troubleshoot from the failure message and the user surface.
5. If write-capable tools are not available, identify the Claude surface and use the setup guidance below.

## Surface-Specific Guidance

### Claude Code CLI

This is the known supported path for the official Figma plugin and remote write tools.

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
8. Run `/mcp` and confirm the Figma server/tools are connected.
9. Retry with a Figma file URL or selection URL.

This browser authorization flow is the auth method. Do not ask the user to create or paste a Figma personal access token for this skill.

### Claude Desktop

Do not give Claude Code CLI commands unless the user is actually using Claude Code. Tell the user to connect Figma from Claude Desktop connectors, integrations, or app settings if that option is available on their plan/workspace. Then ask them to retry the Figma request and verify whether write-capable tools appear.

If Claude Desktop only exposes read/context tools, route write-to-canvas work to Claude Code CLI or another Claude surface that can verify remote Figma write tools.

### Claude.ai web or Claude chat

Do not give terminal commands. Tell the user to connect Figma from Claude.ai connectors or integrations if Figma is available on their plan/workspace. Then verify whether the chat exposes write-capable Figma tools.

If Claude.ai web or Claude chat only exposes a read-only Figma connector, explain that the connector may be useful for context but is not enough for this `figma-writing` skill. Route write-to-canvas work to Claude Code CLI or a verified write-capable Claude surface.

### Claude Cowork

Do not assume Claude Cowork can use the remote Figma MCP write tools, even when the same user account works in Claude Code CLI or Claude Desktop. If Cowork lacks write-capable Figma tools or refuses to use the remote Figma MCP server, tell the user this appears to be a Cowork surface limitation and route the task to Claude Code CLI for Figma writing.

### Unknown surface

Ask which Claude surface the user is using. If they need immediate Figma writing and are unsure, recommend Claude Code CLI because it has the clearest official remote Figma setup path.

## Write-Capable Requirement

For Figma writes, do not treat any Figma connection as sufficient. Confirm all of these before relying on the setup:

1. The current Claude surface exposes write-capable Figma operations, such as `use_figma`, not only context or metadata readers.
2. The Figma connection has completed browser or connector authorization.
3. The authenticated Figma account can access the target file.
4. The authenticated Figma account has edit access to the target Figma Design or FigJam file.
5. The user supplied a target file URL or selection URL.

The Figma-provided `figma-use` skill is the foundational write-to-canvas workflow. It can guide creation of frames, components, variables, layouts, and editable canvas content when the required remote MCP tools and user permissions are available.

Skills do not add MCP capabilities. If only read/context tools are available, this `figma-writing` skill must stop and provide surface-specific setup or fallback guidance instead of pretending it can edit the file.

## Troubleshooting After Failure

If the write attempt fails, troubleshoot in this order:

1. Missing write tool: the current Claude surface does not expose `use_figma` or an equivalent write-capable tool.
2. Wrong surface: the user is in Claude Cowork, Claude.ai web, Claude chat, or Claude Desktop with a read-only connector.
3. Authorization: Figma is installed but not authorized, the connector expired, or `/plugin` does not show connected in Claude Code CLI.
4. File access: the authenticated Figma account can view but not edit the target file.
5. Targeting: the user supplied a file URL without enough context, a stale selection URL, or no URL.
6. Tool mismatch: the active connection is desktop MCP, local MCP, Dev Mode MCP, `figma-desktop`, a personal access token flow, or an SSH tunnel.

Keep recovery advice short. Give the exact setup path only for the surface the user is on, and route to Claude Code CLI when the surface cannot expose write-capable Figma tools.

## Read-Only Symptoms

If any of these appear, stop before writing and explain the likely setup issue:

- Claude can inspect frames, components, variables, or metadata but cannot create or update nodes.
- The available Figma tools look context-only or read-only.
- The only active Figma connection is desktop MCP, local MCP, Dev Mode MCP, or `figma-desktop`.
- The MCP server is disconnected, unauthenticated, or missing from `/mcp`.
- The Figma plugin is installed but not authorized in `/plugin`.
- The user can open the file but cannot edit it in Figma.
- The user is on a seat or file permission level that prevents writing to the target file.

## Sources To Check When Guidance May Have Changed

- Figma Help: Claude Code and Figma: Set up the MCP server
- Figma Help: Guide to the Figma MCP server
- Figma Help: Figma MCP collection: How to set up the Figma remote MCP server
- Figma Help: Figma skills for MCP
