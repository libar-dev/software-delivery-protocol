---
id: spec:consumers.agent-client-support
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:consumers.shipped-protocol-corpus
    reason: the package the shipped corpus describes reaches each served agent client by the route this Spec names
  decidedBy:
    - target: spec:decisions.agent-plugin-package
      reason: the skills reach a client through the portable layout, and a client-specific file ships only where a served client cannot load it
    - target: spec:decisions.session-start-hook
      reason: every orientation route runs the one hook script that decision ships
---
# Each agent client the Protocol serves loads its skills and orientation through the standard or a named shim

The package is an Agent Plugin under the Agent Plugins 1.0.0 standard. The standard's portable core is skills and MCP servers. It keeps hooks out of that core and gives each client a reverse-domain extension namespace for its own manifest data and files. So the skills reach a client through the standard wherever the client reads the portable layout, and the orientation hook reaches it through the client's own namespace where the client implements one. Any other file the package ships for one client is a compatibility shim. Each client was checked at the version its Design entry names; a later version that changes a route changes that entry.

## Intent

- outcome: Let a person use the Protocol's skills, and start each session with its orientation answers in context, in every agent client the Protocol serves: through the Agent Plugins standard wherever the client implements it, and through a named compatibility shim elsewhere, with each client's route and gaps readable from the graph.


## Behavior

- rule: [#servedClients] The Protocol serves six agent clients: Claude Code, Codex, Kimi Code, Grok Build, ZCode and OpenCode. Each has one Design entry naming the version it was checked at, its route for the skills and its route for the orientation answers; a route not yet served is an open question.
- rule: [#floor] Claude Code and Codex are served in full: each loads the skills and adds the orientation answers to the session's context, in an interactive session and in a headless one, Codex's `exec` and `app-server` threads included.
- rule: [#standardFirst] A route uses the standard wherever the client implements it: the root `plugin.json` and `skills/` for the skills, and the client's extension namespace for its hook wiring. A file the package ships for one client outside the standard is a compatibility shim: it names its client, carries only the wiring to the shared skills and script, and holds no rule, answer or skill text of its own.
- rule: [#oneScript] Every orientation route runs the one script, `hooks/session-start.mjs`, from the plugin root in the session's project. The script prints its answers as additional-context JSON for the event that ran it, which Claude Code, Codex and ZCode read at session start: once per event at session start, and once per session for any other event. A route whose client reads plain text, or has no command hooks, asks the script for the text alone.
- rule: [#personSteps] A route that needs a step in a person's own client settings, such as naming the plugin's folder, names that step in the README; the package never writes a client's settings.
- rule: [#reachesContext] A route is served only when the orientation answers reach the model's context in that client, checked at the version its Design entry names; output the client shows the person, keeps in a log or discards does not count, and neither does the script's own output.

## Design

- claudeCode: Claude Code 2.1.318. Skills: the plugin root, loaded without a manifest of its own and named after its directory, or a project's `.claude/skills`. Orientation: the root `hooks/hooks.json`, Claude Code's own plugin layout and its compatibility shim, through `${CLAUDE_PLUGIN_ROOT}`; Claude Code reads no root `plugin.json` and implements no extension namespace. Installing the plugin is the trust decision.
- codex: Codex 0.166.0. Skills: the root `plugin.json` and `skills/`, which Codex reads as a conformant client, or a project's `.agents/skills`. Orientation: the `hooks` entry under the `com.openai` namespace in `plugin.json`, the standard's client-extension route, through `${PLUGIN_ROOT}`; that entry replaces the default `hooks/hooks.json`, so Codex never runs the Claude Code shim. Codex reviews each hook by a hash of the plugin's contents, so each release needs the person's review again, and a plugin with hooks stays out of its public directory.
- zcode: ZCode runtime 0.17.0, through the `zcode-app-cli` 3.16.2 terminal client. Skills: a project's `.agents/skills`, or the plugin's `skills/`. Plugin: ZCode finds a plugin only through a client manifest, so `.zcode-plugin/plugin.json`, naming the plugin and nothing else, is its compatibility shim, and a person adds the package's folder to ZCode's plugin directories. Orientation: the root `hooks/hooks.json`, read in Claude Code's shape; ZCode adds only the JSON additional context, never plain text.
- openCode: OpenCode 2.2.5. Skills: a project's `.claude/skills` or `.agents/skills`, or the package's `skills/` named in the project's OpenCode config. Orientation: a compatibility shim, a plugin module that runs the script when a session is created and adds its text through the session's context hook, alike in the terminal, in `opencode run` and in the background service; a person names the module in the project's OpenCode config.
- kimiCode: Kimi Code 2.4.1. Skills: `kimi.plugin.json` naming `skills/`, its compatibility shim, or a project's `.agents/skills`. Orientation: a prompt-submit hook in the person's Kimi Code settings, which runs in the session's project and asks the script for the text alone, once per session, since this version discards a session-start hook's output and passes a plugin's hooks no working directory, though Kimi Code's current documentation describes both.
- grokBuild: Grok Build 1.0.70. Skills: the root `plugin.json` and `skills/`, the first manifest this version looks for, measured and never a published Agent Plugins claim, or a project's `.claude/skills` or `.agents/skills`. Orientation: a pre-tool hook in the person's or the project's Grok Build hooks, answered once per session as that event's additional context, so the answers reach the model with its first tool call, never before its first reply, since this version shows a session-start hook's output only on the screen.
