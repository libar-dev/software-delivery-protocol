# S3 platform measurement

Measured with the engine source at `95d136b813c45ce2036e7f9f5a998813f6350883`, on a fresh clone of libar-platform at
`b038bd4`. The original platform checkout was read only. `measurements.json` records the Node
binary, working directory, argument arrays and exit status of every command as run.

The probe changes one Design entry on the disposable copy,
`spec:advanced.coalesced-recomputation#design.deferred`: `the dirty-mark table` becomes
`the coalesced dirty-mark table`. The base is the graph `sdp build` wrote before that edit,
saved outside the copy. The Studio receives it through `--base` with a label.

Re-run from the Protocol checkout after `npm run build`, choosing a copy path that does not exist:

```sh
node reviews/assets/plan46-s3/measure.mjs /tmp/build-s3-platform-next > /tmp/plan46-s3-next.json
```

The optional second argument is the source Git directory, defaulting to the path in the common
build brief. The script prints a new measurement and leaves its disposable copy and base graph
for inspection. It compares the rendered statement order with recipe 46, checks the base input's
bytes, and repeats publication with `--check-clean`. Recipe 35 supplies the diff counts and
recipe 46 supplies the queue's totals and first round; re-run them rather than inheriting this
snapshot.

No screenshot is included. The browser URL policy rejected the local-file preview. The page and
link tests and the design detector ran; visual inspection remains unverified.
