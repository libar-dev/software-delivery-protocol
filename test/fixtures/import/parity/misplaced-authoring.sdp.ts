import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

export function misplacedAuthoringProbe() {
  return codeAnchor({
    id: codeAnchorId("impl:parity.misplaced-authoring"),
    satisfies: ref("spec:parity.misplaced-authoring"),
  });
}
