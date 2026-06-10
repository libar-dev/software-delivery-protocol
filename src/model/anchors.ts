import type { ImplAnchorId, SpecId, TestAnchorId } from "../ids.js";

export interface ImplementationAnchor {
  readonly id: ImplAnchorId;
  readonly label?: string;
  readonly satisfies: SpecId;
}

export interface SpecTestAnchor {
  readonly id: TestAnchorId;
  readonly label?: string;
  readonly verifies: SpecId;
}

export type Anchor = ImplementationAnchor | SpecTestAnchor;

export function anchorImplementation(anchor: ImplementationAnchor): ImplementationAnchor {
  return {
    ...anchor,
  };
}

export function specTest(anchor: SpecTestAnchor): SpecTestAnchor {
  return {
    ...anchor,
  };
}
