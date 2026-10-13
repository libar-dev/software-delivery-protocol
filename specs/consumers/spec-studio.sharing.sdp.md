---
id: spec:consumers.spec-studio.sharing
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:extraction.schema-versioning
    - spec:consumers.engine-provenance
  constrainedBy: spec:extraction.determinism
---
# A Studio build is stamped and shared from a static host

## Intent
- outcome: Let a stakeholder open the Studio of a pull request from a link, and let its author know which graph and which build the stakeholder read.
### Open questions
- [non-blocking #stampLoading] How does the shell read the publishing stamp while generated pages stay a function of the graph and a page opened through `file://` makes no request, which keys does the stamp hold, and which step publishes a preview?
  - decider: owner
  - links: spec:consumers.spec-studio#question.phaseZeroSplit
  - provisional: the shell reads `stamp.json` only when served over http or https, so a `file://` page makes no stamp request; its keys are `schemaVersion`, `corpusCommit`, `engine` and `builtAt`; publishing a preview and writing its stamp are the adopter's step, and the Studio build writes only its graph-derived page set

## Behavior
- rule: A build is shared by uploading its page set to a static host, such as S3, Vercel or GitHub Pages.
- rule: Each pull request can publish its Studio as a preview.
- rule: A stakeholder opens the link, navigates the Studio and composes intent, and the pull request's author hands that intent to an agent that edits the source.
- rule: The Studio's build writes no stamp, so every page and data file it writes stays a function of the graph alone. The publishing step that uploads a build writes one stamp file beside the page set, and the shell shows it as build context when it is present.

## Design
- buildStamp: `stamp.json` beside the page set, written by the publishing step and never by the Studio's build, holding the graph's `schemaVersion`, the git commit the build came from or `unknown` for a local build, the engine `sdp --version` names, and the build time.
- previewPath: a pull request's preview is served at `<host>/preview/<pr-number>/`.
