# Build a Spec

For implementing a Spec, usually one its author has stated `ready`. The Spec is the brief: read
it from the graph at your commit, never from a summary or an earlier session. Building below
`ready` is ordinary work; once code binds such a Spec the drift alarm names it until its owner
states `ready`, which says design is unfinished, never that the build is refused.

1. **Read the brief.** Orientation 10 on the Spec for its outline, the law it rests on (recipe 56,
   `dist/recipes/56-the-law-a-spec-rests-on.js`), and what it guarantees and who verifies it
   (recipe 3, `dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js`). Then run
   the shipped brief body, `scripts/brief.js`:

```sh
node <skill-dir>/../sdp-agent-surface/scripts/q.mjs "$(cat <skill-dir>/scripts/brief.js)" --params '{"spec":"<the Spec>"}'
```

It reads the open-question register (recipe 20, `dist/recipes/20-open-question-register.js`),
pinned declarations (recipe 24, `dist/recipes/24-pinned-declarations.js`) and rule coverage
(recipe 34, `dist/recipes/34-rule-coverage.js`) for this Spec: `holds`, the blocking questions
on it and on each Spec it rests on; `buildOn`, the non-blocking ones with their provisional
readings; `noReading`, the non-blocking ones that give none; `declarations`, the names,
signatures and shapes the code holds to (`spec:extraction.contract-declarations`);
`unexercised`, its keyed rules no enabled example exercises yet; and `refinedBy`, the Specs
refining it, which the brief leaves out.

2. **Settle which Specs the build takes in.** The brief covers one Spec. For the rest of a
   feature, choose which of `refinedBy` the work takes in, and repeat step 1 for each, following
   its own `refinedBy` as far as the work goes: a brief names a rule only by its address, and
   recipe 3 gives its text. Several Specs built together read as one design slice (recipe 54,
   `dist/recipes/54-the-design-slice.js`, with `specs`).
3. **When `holds` or `noReading` lists a question,** take it to its decider, or to whoever gave
   the work when it names none. Build what does not depend on the answer meanwhile: code that
   answers it waits, and writing it anyway is a tripwire.
4. **Tests first.** Each rule gets a test before the code that satisfies it. An example child
   becomes executable as `sdp-authoring` teaches; otherwise the suite carries a top-level
   `specTest` anchor whose `verifies` names the Spec. A rule no example exercises still gets a
   test, and the author may want an example for it.
5. **Write the code** to the pinned declarations and the rules. Private names, decomposition, file
   layout and the algorithm behind a stated outcome are the build's. Bind it with a code anchor
   whose targets pass the promise test in `sdp-authoring`.
6. **Leave open choices open.** Build on each `buildOn` question's provisional reading, and leave
   the question open. A choice the Spec leaves open without a question goes back to it as a
   question or a change proposal ([proposals.md](proposals.md)), unless only the build can answer
   it. Code never settles what the Spec left open.
7. **Close.** Orientation 10 shows the Spec `implemented` and `has-verifier`: a binding exists,
   never that it passed, which is CI's. Orientation 4's `driftAlarm` lists each Spec implemented
   below `ready`, with its floor. Expect none after building a `ready` Spec; a Spec built below
   `ready` stays listed until its owner states the rung. The hand-off names each listed Spec, the
   ones the build bound and the ones it found, and states no rung for the owner. Orientation 9 on
   the changed files gives their reach; then hand off as the skill says.
