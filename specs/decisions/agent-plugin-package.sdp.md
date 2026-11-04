---
id: spec:decisions.agent-plugin-package
kind: decision
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:consumers.shipped-protocol-corpus
    reason: settles the form in which the package ships its skills
  dependsOn:
    target: spec:decisions.mcp-deferred
    reason: the plugin declares no MCP server while MCP integration stays deferred
---
# The package is a portable Agent Plugin

## Intent
- outcome: Let any agent client that reads the open Agent Plugins format load the Protocol's skills from the installed package, at the version the project pinned, with no client-specific copy to keep in step.

## Decision
- context: The skills shipped under a dot-directory that no client loads as a plugin and that discovery skips. Each agent client has its own plugin format, and the open Agent Plugins standard, version 1.0.0, defines one portable floor: a root `plugin.json`, Agent Skills under `skills/`, and an optional `mcp.json`.
- decision: The package root is the Agent Plugin root. A root `plugin.json` declares it under the Agent Plugins 1.0.0 schema, named after the package's unscoped name, and the skills live under `skills/` in the Agent Skills format. The package adds a client-specific file, such as a client's own manifest or marketplace entry, only when a client it serves cannot load the portable layout. A file that more than one client it serves reads at the plugin root in one shape, such as `hooks/hooks.json`, is shared, not client-specific, and may ship. The package declares no `mcp.json` while MCP integration stays deferred.
- rationale: Hard to reverse: adopters load the skills from the paths this ruling fixes, and their client settings name the plugin root and the plugin's name. Surprising without context: the repository root reads as a plugin, and the client-specific manifest a reader might expect is absent on purpose. A real trade-off: one directory that keeps every cited path inside the plugin, with skill and CLI always at one version, against a root that carries `plugin.json` and `skills/` beside the source tree.
- rationale: One directory is the repository, the npm package and the plugin, so every path a skill cites stays inside the plugin root, and a skill loaded from the installed package always matches the CLI beside it.
- rationale: Claude Code loads the portable layout without a manifest of its own and names the plugin after its directory, which is the package's unscoped name wherever the package is installed or cloned.
- alternative: A plugin folder below the root keeps the root uncluttered, but puts the glossary, the recipe catalog and the shipped recipes outside the plugin, where the standard denies access.
- alternative: A client-specific manifest beside the portable one is a second copy that a client reading the portable layout does not need, and it drifts from the first.
- consequence: The repository root carries `plugin.json` and `skills/`; in the source checkout, `.agents/skills` and `.claude/skills` are relative links to `skills/` for project discovery.
- consequence: A skill loaded from another copy of the package than the CLI it runs can teach a different version, so the reading skill's runner warns when the two differ.
