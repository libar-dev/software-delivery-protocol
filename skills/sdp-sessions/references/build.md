# Build a Spec

For implementing a Spec, usually one its author has stated `ready`. The Spec is the brief: read
it from the graph at your commit, never from a summary or an earlier session. Building below
`ready` is ordinary work; once code binds such a Spec the drift alarm names it, which says design
is unfinished, never that the build is refused.

1. **Read the brief.** Orientation 10 on the Spec for its outline, then:
   - the law it rests on (recipe 56, `dist/recipes/56-the-law-a-spec-rests-on.js`);
   - what it guarantees and who verifies it (recipe 3,
     `dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js`);
   - pinned declarations (recipe 24, `dist/recipes/24-pinned-declarations.js`), filtered to the
     Spec: the names, signatures and shapes the code holds to (`spec:extraction.contract-declarations`);
   - rule coverage (recipe 34, `dist/recipes/34-rule-coverage.js`): the keyed rules no example
     exercises yet.

   Several Specs built together read as one design slice (recipe 54,
   `dist/recipes/54-the-design-slice.js`).

2. **Raise an open blocking question** on the Spec, or on one it rests on, with its decider
   before writing code that answers it: building past it is a tripwire.
3. **Tests first.** Each rule gets a test before the code that satisfies it. An example child
   becomes executable as `sdp-authoring` teaches; otherwise the suite carries a top-level
   `specTest` anchor whose `verifies` names the Spec. A rule no example exercises still gets a
   test, and the author may want an example for it.
4. **Write the code** to the pinned declarations and the rules. Private names, decomposition, file
   layout and the algorithm behind a stated outcome are the build's. Bind it with a code anchor
   whose targets pass the promise test in `sdp-authoring`.
5. **Leave the Spec's open choices open.** Where the Spec leaves a choice open, build on its
   `provisional` reading and return the choice to the Spec as an open question or a change
   proposal ([proposals.md](proposals.md)). Code never settles what the Spec left open.
6. **Close.** Orientation 4 shows no drift alarm, and orientation 10 shows the Spec `implemented`
   and `has-verifier`: a binding exists, never that it passed, which is CI's. Orientation 9 on the
   changed files gives their reach; then hand off as the skill says.
