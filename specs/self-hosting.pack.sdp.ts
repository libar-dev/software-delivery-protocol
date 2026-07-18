import { pack, packId, ref } from "@libar-dev/software-delivery-protocol";

export const selfHostingV1Pack = pack({
  id: packId("pack:self-hosting-v1"),
  title: "Self-hosting phase 1",
  framing: "The Protocol authors and validates its own phase-1 delivery model.",
  specs: [
    ref("spec:carrier.markdown-authoring"),
    ref("spec:carrier.envelope-contract"),
    ref("spec:carrier.markdown-parser"),
    ref("spec:carrier.sdp-import"),
    ref("spec:carrier.prose-ownership-rule"),
    ref("spec:protocol.self-hosting"),
    ref("spec:extraction.derive-graph"),
    ref("spec:extraction.determinism"),
    ref("spec:extraction.build-pipeline"),
    ref("spec:validation.readiness-floor"),
    ref("spec:validation.duplicate-ids"),
    ref("spec:model.protocol-domain"),
  ],
  modelRefs: [ref("spec:model.protocol-domain")],
});
