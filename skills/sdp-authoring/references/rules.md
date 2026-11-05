# Write corpus rules

For a project policy run as a rules file: corpus guidance, never a Protocol validator, moving no
floor. It is an async `sdp q` body reading only the graph, the report and its parameters, and
returns `{ findings }` (`spec:validation.corpus-rules#rule.readsGraphOnly`,
`spec:validation.corpus-rules#design.ruleFinding`).

These shipped recipes run unchanged as a rules file: `dist/recipes/25-address-resolution.js`,
`dist/recipes/26-dependency-cycles.js`, `dist/recipes/42-the-architecture-walk.js`,
`dist/recipes/50-external-registers.js` and `dist/recipes/51-entry-citations.js`. Or compose
them:

```js
const severity = params.severity ?? "error";
const addresses = await recipes(25, { addresses: params.addresses ?? [], severity });
const cycles = await recipes(26, { severity });

for (const answer of [addresses, cycles]) {
  if (!Array.isArray(answer.findings)) {
    throw new Error(JSON.stringify(answer));
  }
}

return { findings: [...addresses.findings, ...cycles.findings] };
```

Throw on an answer without `findings`, so a recipe's diagnostics fail the file. Run it with
`sdp validate --rules PATH`, each `--params` after its own `--rules`.
