# Entry addresses

An entry address names one keyed entry of a Spec: `spec:<id>#design.<key>` or
`spec:<id>#ui.<key>` a Design or UI entry, `spec:<id>#question.<key>` the open question whose
marker carries the key, `spec:<id>#rule.<key>` the rule or flow entry whose `[#key]` marker
carries it, and `spec:<id>#term.<key>` a keyed Model term. The address rules are carried by
`spec:decisions.checked-mentions` and `spec:model.term-addresses`. Step keys name generated
contract steps and have no address; `spec:carrier.step-keys` carries them.

- An unresolved entry address mentioned in Spec prose is a Protocol prose-mentions error.
- An address written outside the Specs, in a register, a test or a page, is checked by address
  resolution (recipe 25), one row per address.
- An entry address cited in source is recorded only when the source file carries a recognized
  anchor. Entry citations (recipe 51) lists those citations. Unresolved source citations become
  corpus findings only when recipe 51 is selected through `validate --rules`; ordinary validation
  does not report them. A non-empty `testAnchors` list identifies a citing file whose test anchor
  verifies the cited Spec directly or through an example. It records no assertion result.
- Entry search (recipe 23) returns an address for an addressable Design or UI entry, a keyed open
  question, a keyed rule or flow, or a keyed Model term. Other entries, including `description`
  in Design or UI and off-grammar keys such as `"01"`, return `address: null`.
