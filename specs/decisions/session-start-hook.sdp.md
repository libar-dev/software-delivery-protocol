---
id: spec:decisions.session-start-hook
kind: decision
altitude: feature
readiness: defined
relations:
  refines:
    target: spec:decisions.agent-plugin-package
    reason: narrows the plugin's contents to one hooks file that both clients read and the session-start script it runs
  dependsOn:
    - target: spec:consumers.reading-on-ramp
      reason: the hook runs the reading skill's orientation runner from the session's project and prints its answers
    - target: spec:protocol.roadmap-replaces-plans
      reason: the handbook keeps the roadmap pointer the self-hosting gate reads, whatever a hook prints
---
# The plugin ships a session-start hook that delivers live orientation answers; the handbook keeps every rule

Claude Code and Codex can run a command when a session starts and add its output to the model's context. That output can be the graph's own orientation answers for the session's project, derived at that moment, where a handbook can only ask an agent to fetch them. A hook reaches fewer readers than a handbook, though, so it carries answers and the handbook keeps every rule.

## Intent
- outcome: Start each agent session in a Protocol project with the graph's current orientation answers already in context, while every rule, pointer and hazard stays in the handbook that every client and subagent reads.

### Open questions
- [non-blocking #arcBlock] Does the hook print the owner's temporary arc block in the Protocol checkout, only while the arc's branch is checked out, in place of the block at the top of the handbook?
  - decider: owner
  - provisional: no while this arc is open; the block stays in the handbook until the owner removes it.

## Decision
- context: Agent Plugins 1.0.0 defines skills and MCP servers as its only portable components, names hooks as too client-specific for v1, and leaves client behavior to reverse-domain extensions, from which neither Claude Code nor Codex documents reading hooks. Both clients read a plugin's `hooks/hooks.json` at the plugin root by default, in one shape, run its SessionStart command hooks and add their plain standard output to the model's context; Codex sets Claude Code's plugin-root variable for compatibility. Both also read project hooks, from `.claude/settings.json` and `.codex/hooks.json`. Hook output reaches only the main session of a client that runs hooks, after the user trusts them; the handbook reaches every client and, in Claude Code, every subagent except Explore and Plan.
- decision: The owner answered that the plugin ships the hook by default. The package root carries `hooks/hooks.json` and one dependency-free Node script, `hooks/session-start.mjs`, which both clients run at every session start through the plugin-root variable. The script takes the session's project from the hook input's working directory, finds the Protocol checkout or the installed package at or above it, and runs that project's own orientation runner for the corpus-and-surface and next-work answers, printed within a bounded size. It prints one short line when the runner fails or no Spec derives, nothing where no package is installed, and nothing for a second copy of the same session event. It exits 0 on every path and never validates, builds or publishes. It prints answers and never rules: every rule, pointer and hazard stays in the handbook, which keeps its one-line orientation step for the readers the hook does not reach.
- rationale: Hard to reverse: a hook published in the plugin runs in adopter sessions the Protocol cannot recall, and once a handbook drops a rule because a hook printed it, every subagent, untrusted workspace and client without hooks silently loses that rule. Surprising without context: the handbook still names an orientation step the hook already ran, and the plugin carries a hooks file although Agent Plugins names no hook component. A real trade-off: answers that arrive without an agent's compliance, in every enabled session, against a channel that only some clients run, only after trust, only in the main session, adding a graph derivation before the first response.
- rationale: Orientation answers are derived per commit and go stale in prose; a session-start hook is the one channel that delivers them current, unasked. A failed run costs one printed command, while a rule printed only by a hook vanishes whenever the hook does not run.
- rationale: One hooks file at the plugin root serves both clients in one shape, so the portable layout stays the only layout an adopter loads and no client-specific manifest ships.
- alternative: A repository hook only, with the plugin shipping none. Adopter sessions pay nothing, but their agents start without the answers the Protocol's own sessions get.
- alternative: The hook prints the orientation pointer and the handbook drops it. That saves one handbook line for a client's main session, and loses the pointer for subagents, for sessions without trusted hooks and for every other client.
- alternative: The script resolves the project from its own location. That is right in the Protocol checkout, but loaded from an installed plugin it would print the Protocol's corpus in an adopter's session.
- alternative: An extension directory such as `com.anthropic.claude-code/hooks/`. Agent Plugins allows it, but neither client documents reading one: Codex reads the hooks its own manifest names, and Claude Code reads `hooks/hooks.json` or its own manifest's `hooks` key.
- alternative: No hook, the handbook alone. No hooks file ships, and orientation stays an instruction an agent may skip.
- consequence: The package's published files include `hooks/`. Every session where the plugin is enabled and its hook trusted pays one graph derivation before the first response, and a user-scope install fires in projects without the package, where it prints nothing.
- consequence: Codex keeps plugins with hooks out of its public plugin directory, and each client runs the hook only after its own trust review.
- consequence: The Protocol checkout, which no client loads as a plugin, wires the same script from `.claude/settings.json` and `.codex/hooks.json`. That wiring is temporary: it goes when the checkout loads itself as a plugin or a client reads the shared form from a project, and neither file ships. A session that runs both the plugin's hook and the checkout's wiring prints the answers once.
- consequence: A session started where the runner cannot run, such as a fresh worktree without `dist/`, receives the one-line remedy in place of answers.
- consequence: The heads-up display the owner named for later extends this hook with branch and changeset context.
