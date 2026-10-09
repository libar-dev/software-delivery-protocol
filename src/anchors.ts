/**
 * The zero-dependency anchor subpath, `@libar-dev/software-delivery-protocol/anchors` (the
 * comment-form decision, `spec:decisions.anchor-comment-form`; v0 02 §3): the id builders and the
 * three anchor builders, and nothing else. A runtime that may import but must never load
 * `node:*` or ts-morph binds its constant-form anchors through this entry; the extractor trusts
 * the specifier exactly as it trusts the bare package specifier.
 */
export {
  anchorId,
  codeAnchorId,
  componentAnchorId,
  oracleAnchorId,
  packId,
  ref,
  specId,
  testAnchorId,
  CODE_ANCHOR_NAMESPACES,
} from "./ids.js";
export type {
  AnchorId,
  CodeAnchorId,
  ComponentAnchorId,
  OracleAnchorId,
  PackId,
  SpecId,
  TestAnchorId,
} from "./ids.js";
export { codeAnchor, specOracle, specTest, CODE_ANCHOR_LAYERS } from "./model/anchors.js";
export type {
  Anchor,
  CodeAnchor,
  CodeAnchorLayer,
  SpecOracleAnchor,
  SpecTestAnchor,
} from "./model/anchors.js";
