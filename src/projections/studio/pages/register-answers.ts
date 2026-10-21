import type { PageContext } from "./html.js";

// The shipped bodies own these answers. Pages select and format fields, without recomputing them.
interface RegisterAnswers {
  20: Questions;
  24: Declarations;
  31: Decisions;
  33: Backlog;
  35: Diff;
  46: Queue;
  51: Citations;
}
export function answer<N extends keyof RegisterAnswers>(
  ctx: PageContext,
  number: N,
): RegisterAnswers[N] {
  return ctx.data.recipes.all.get(number) as RegisterAnswers[N];
}
export interface Question {
  readonly blocking: boolean;
  readonly question: string;
  readonly key: string | null;
  readonly decider: string | null;
  readonly links: readonly string[];
  readonly provisional: string | null;
  readonly trigger: string | null;
  readonly deferral: boolean;
}
export interface Questions {
  readonly totals: Readonly<Record<string, number>>;
  readonly specs: readonly {
    readonly id: string;
    readonly statedReadiness: string;
    readonly questions: readonly Question[];
  }[];
  readonly malformed: readonly unknown[];
}
export interface Decision {
  readonly id: string;
  readonly title: string | null;
  readonly statedReadiness: string;
  readonly supersedes: readonly string[];
  readonly supersededBy: readonly string[];
  readonly refines: readonly string[];
  readonly refinedBy: readonly string[];
  readonly shapes: readonly string[];
  readonly reasons: readonly {
    readonly type: string;
    readonly to: string;
    readonly reason: string;
  }[];
  readonly questions: readonly { readonly address: string; readonly blocking: boolean }[];
}
export interface Decisions {
  readonly totals: {
    readonly decisions: number;
    readonly byRung: Readonly<Record<string, number>>;
    readonly superseded: number;
    readonly shapingNothing: number;
  };
  readonly rows: readonly Decision[];
}
export interface Declarations {
  readonly totals: { readonly entries: number; readonly specs: number };
  readonly rows: readonly {
    readonly spec: string;
    readonly key: string;
    readonly declaration: string;
  }[];
}
export interface Citations {
  readonly entries: readonly {
    readonly address: string;
    readonly citedBy: readonly {
      readonly file: string;
      readonly line: number;
      readonly testAnchors: readonly string[];
    }[];
  }[];
}
export interface Backlog {
  readonly totals: {
    readonly specs: number;
    readonly byFamily: Readonly<Record<string, number>>;
    readonly excludedExamples: number;
    readonly excludedDecisions: number;
    readonly withReferences: number;
  };
  readonly rows: readonly {
    readonly id: string;
    readonly specKind: string;
    readonly altitude: string;
    readonly floorReached: string;
    readonly statedNextRungFailures: readonly string[];
    readonly design: {
      readonly entries: number;
      readonly declarations: number;
      readonly openQuestions: number;
      readonly blockingQuestions: number;
    };
    readonly referencedBy: readonly string[];
  }[];
}
export interface Queue {
  readonly totals: {
    readonly waiting: number;
    readonly firstRound: number;
    readonly rounds: number;
    readonly cycles: number;
    readonly questions: number;
    readonly blockingQuestions: number;
    readonly withoutDecider: number;
    readonly blockingWithoutDecider: number;
  };
  readonly statements: readonly {
    readonly place: number;
    readonly round: number;
    readonly id: string;
    readonly title: string | null;
    readonly specKind: string;
    readonly packs: readonly string[];
    readonly statedReadiness: string;
    readonly floorReached: string;
    readonly restsOn: readonly string[];
  }[];
  readonly questions: readonly {
    readonly address: string | null;
    readonly spec: string;
    readonly index: number;
    readonly question: string;
    readonly blocking: boolean;
    readonly decider: string;
    readonly holds: readonly string[];
  }[];
  readonly cycles: readonly {
    readonly members: readonly string[];
    readonly cycle: readonly string[];
  }[];
}
export interface Delta {
  readonly added: readonly string[];
  readonly removed: readonly string[];
}
export interface Diff {
  readonly base?: { readonly schemaVersion: string; readonly specs: number };
  readonly head?: { readonly schemaVersion: string; readonly specs: number };
  readonly totals?: {
    readonly added: number;
    readonly removed: number;
    readonly changed: number;
    readonly packs: number;
    readonly bindings: number;
  };
  readonly specs?: {
    readonly added: readonly string[];
    readonly removed: readonly string[];
    readonly changed: readonly {
      readonly id: string;
      readonly parts: readonly {
        readonly part: string;
        readonly change: string;
        readonly from: unknown;
        readonly to: unknown;
      }[];
    }[];
  };
  readonly packs?: readonly {
    readonly id: string;
    readonly change: string;
    readonly membersAdded: readonly string[];
    readonly membersRemoved: readonly string[];
    readonly reordered: boolean;
  }[];
  readonly bindings?: readonly {
    readonly id: string;
    readonly implementedBy: Delta;
    readonly referencedBy: Delta;
    readonly verifiers: Delta;
    readonly deliveryFacts: Delta;
  }[];
  readonly diagnostics: readonly unknown[];
}
