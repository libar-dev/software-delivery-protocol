# Agent Plugins schemas

`1.0.0/plugin.schema.json` is the Agent Plugins 1.0.0 manifest schema, copied verbatim from
[agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec/blob/ff8ab5e392cc87bd88d87c060815a87490e51003/schemas/1.0.0/plugin.schema.json)
under the Apache License 2.0. `test/skills.test.ts` validates the root `plugin.json` against it
offline: the standard forbids a client from fetching a schema while loading a plugin, and the tests
never reach the network for one either.
