/** The full answer of the shipped design-slice recipe, shared by its page and drawings.
 * @sdpAnchor impl:protocol.studio-slice-answer
 * @sdpLabel full design slice answer consumed by the page and drawings
 * @sdpReferences spec:consumers.design-slice
 * @sdpComponent component:protocol.projections
 * @sdpRole contract
 */
export interface SliceMember {
  readonly id: string;
  readonly title: string | null;
  readonly specKind: string;
  readonly statedReadiness: string;
  readonly floorReached: string | null;
  readonly statedNextRung: string | null;
  readonly depth: number;
  readonly exampleOf: string | null;
  readonly exampleMembers: readonly string[];
  readonly holds: readonly {
    readonly clauseId: string;
    readonly description: string;
    readonly targets: readonly {
      readonly id: string;
      readonly type: string;
      readonly statedReadiness: string | null;
    }[];
  }[];
  readonly design: {
    readonly entries: number;
    readonly declarations: number;
    readonly openQuestions: number;
    readonly blockingQuestions: number;
    readonly decisions: number;
  };
  readonly rules: { readonly total: number; readonly keyed: number };
  readonly examples: { readonly total: number; readonly enabled: number };
  readonly implementedBy: readonly string[];
  readonly referencedBy: readonly string[];
}
export interface SliceBoundary {
  readonly id: string;
  readonly title: string | null;
  readonly statedReadiness: string | null;
  readonly floorReached: string | null;
  readonly implemented: boolean;
  readonly via: readonly {
    readonly type: string;
    readonly members: readonly string[];
    readonly reasons?: readonly { readonly member: string; readonly reason: string }[];
  }[];
  readonly holds: readonly string[];
}
export interface SliceEdge {
  readonly from: string;
  readonly to: string;
  readonly type: string;
  readonly orders: boolean;
  readonly reason?: string;
}
export interface SliceDesign {
  readonly spec: string;
  readonly componentId: string;
  readonly layer: string | null;
  readonly context: string | null;
  readonly role: string | null;
  readonly uses: readonly string[] | null;
  readonly anchorExists: boolean;
  readonly realized: boolean;
  readonly differing: readonly {
    readonly field: string;
    readonly planned: unknown;
    readonly realized: unknown;
  }[];
  readonly unreadable: readonly { readonly key: string; readonly value: string }[];
}
export interface SliceArchitecture {
  readonly components: readonly {
    readonly id: string;
    readonly label: string | null;
    readonly layer: string | null;
    readonly context: string | null;
    readonly members: {
      readonly satisfies: readonly string[];
      readonly references: readonly string[];
    };
    readonly restsOn: readonly string[];
    readonly designs: readonly string[];
  }[];
  readonly designs: readonly SliceDesign[];
  readonly outside: readonly {
    readonly id: string;
    readonly label: string | null;
    readonly layer: string | null;
    readonly context: string | null;
    readonly anchored: boolean;
    readonly reachedBy: readonly string[];
  }[];
  readonly uses: readonly {
    readonly from: string;
    readonly to: string;
    readonly count: number;
    readonly outside: boolean;
    readonly units: readonly {
      readonly from: string;
      readonly to: string;
      readonly claim: string;
    }[];
  }[];
  readonly plannedUses: readonly {
    readonly design: string;
    readonly from: string;
    readonly to: string;
    readonly outside: boolean;
  }[];
  readonly unplaced: readonly {
    readonly unit: string;
    readonly member: string;
    readonly via: string;
  }[];
}
export interface SliceAnswer {
  readonly scope: {
    readonly pack: string;
    readonly title: string | null;
    readonly members: readonly string[];
  };
  readonly totals: {
    readonly members: number;
    readonly exampleMembers: number;
    readonly relations: number;
    readonly depth: number;
    readonly cycles: number;
    readonly heldBelowNextRung: number;
    readonly waitingForAuthor: number;
    readonly restsOn: number;
    readonly holdingOutside: number;
    readonly restedOnBy: number;
    readonly components: {
      readonly touched: number;
      readonly throughMembers: number;
      readonly throughRestsOn: number;
      readonly throughDesigns: number;
      readonly outside: number;
    };
    readonly designs: {
      readonly total: number;
      readonly realized: number;
      readonly matching: number;
    };
    readonly decisions: number;
    readonly decisionsBelowReady: number;
    readonly openQuestions: number;
    readonly blockingQuestions: number;
  };
  readonly members: readonly SliceMember[];
  readonly structure: {
    readonly edges: readonly SliceEdge[];
    readonly unresolved: readonly {
      readonly from: string;
      readonly to: string;
      readonly type: string;
      readonly reason?: string;
    }[];
    readonly cycles: readonly {
      readonly members: readonly string[];
      readonly cycle: readonly string[];
    }[];
  };
  readonly architecture: SliceArchitecture;
  readonly decisions: readonly {
    readonly id: string;
    readonly title: string | null;
    readonly statedReadiness: string;
    readonly floorReached: string | null;
    readonly member: boolean;
    readonly shapes: readonly string[];
    readonly refines: readonly string[];
    readonly supersedes: readonly string[];
    readonly openQuestions: number;
    readonly blockingQuestions: number;
  }[];
  readonly questions: readonly {
    readonly address: string | null;
    readonly spec: string;
    readonly question: string;
    readonly blocking: boolean;
    readonly decider?: string;
    readonly links?: readonly string[];
    readonly provisional?: string;
    readonly trigger?: string;
    readonly holds: readonly string[];
  }[];
  readonly boundary: {
    readonly restsOn: readonly SliceBoundary[];
    readonly restedOnBy: readonly SliceBoundary[];
    readonly verifiedBy: readonly SliceBoundary[];
    readonly supersededBy: readonly SliceBoundary[];
  };
}
