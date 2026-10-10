---
id: spec:consumers.spec-studio.sharing
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:extraction.schema-versioning
  constrainedBy: spec:extraction.determinism
---
# A Studio build is stamped and shared from a static host

## Intent
- outcome: Let a stakeholder open the Studio of a pull request from a link, and let its author know which graph and which build the stakeholder read.
### Open questions
- [blocking #buildStamp] The original stamps the Studio's data with the git commit and the build time; the Studio renders byte-identical files from one graph, and `spec:extraction.determinism` keeps wall-clock timestamps and run-specific values out of generated output. Where does the stamp live, if anywhere?

## Behavior
- rule: A build is shared by uploading its page set to a static host, such as S3, Vercel or GitHub Pages.
- rule: Each pull request can publish its Studio as a preview.
- rule: A stakeholder opens the link, navigates the Studio and composes intent, and the pull request's author hands that intent to an agent that edits the source.

## Design
- dataStamp: each data file carries the graph's `schemaVersion`, the git commit SHA it was built from or `unknown` for a local build, and the build timestamp.
- previewPath: a pull request's preview is served at `<host>/preview/<pr-number>/`.
