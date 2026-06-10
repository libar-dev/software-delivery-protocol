export const SPEC_SECTION_NAMES = [
  "intent",
  "behavior",
  "constraints",
  "model",
  "design",
  "decision",
  "verification",
  "ui",
] as const;

export type SpecSectionName = (typeof SPEC_SECTION_NAMES)[number];

/**
 * The typing law (MD-11): every floor-bearing section — one a readiness-floor clause reads as
 * evidence (`05` §3) — gets a closed typed shape (no index signature). Closed shapes are what reject
 * the in-section honesty bypass (`behavior: { "has-verifier": true }`) at the type level. The
 * genuinely-unsettled surfaces (`design`, `ui`) stay open bags so they keep breathing (L9). The
 * criterion outlives the list: a section becomes typed when a floor clause starts reading it.
 *
 * All fields are optional: types describe shape, validators decide completeness (P7).
 */
export type SpecSectionContent = Record<string, unknown>;

/** An open question is prose, or an object flaggable `blocking` (MD-9: blocks `defined`+). */
export type IntentOpenQuestion =
  | string
  | { readonly question: string; readonly blocking?: boolean };

export interface IntentSection {
  readonly actor?: string;
  readonly problem?: string;
  readonly outcome?: string;
  readonly value?: string;
  readonly risks?: readonly string[];
  readonly assumptions?: readonly string[];
  readonly openQuestions?: readonly IntentOpenQuestion[];
}

/** A structured Given/When/Then entry — the `defined`-complete form of an example (MD-10). */
export interface GivenWhenThen {
  readonly given: readonly string[];
  readonly when: readonly string[];
  readonly then: readonly string[];
}

/** An examples entry matures in place: prose → structured GWT → (promoted) a child `example` spec. */
export type BehaviorExample = string | GivenWhenThen;

/**
 * Content only, never refs (MD-10): rules are prose; promotion to a standalone `rule`/`example`
 * spec moves the content out, and the only linkage is the child's `refines`/`verifies` relation.
 */
export interface BehaviorSection {
  readonly rules?: readonly string[];
  readonly examples?: readonly BehaviorExample[];
  readonly flows?: readonly string[];
}

export interface ConstraintSection {
  readonly flavor?: string;
  readonly statement: string;
  readonly target?: string;
  readonly measurableBy?: string;
}

export interface ModelSection {
  readonly terms?: Readonly<Record<string, string>>;
}

export type DesignSection = SpecSectionContent;

/** No `status` field (MD-11): the adoption arc is the envelope's `readiness`; replacement is `supersedes`. */
export interface DecisionSection {
  readonly context?: string;
  readonly decision?: string;
  readonly rationale?: readonly string[];
  readonly alternatives?: readonly string[];
  readonly consequences?: readonly string[];
}

export type VerificationMode = "manual" | "reviewed" | "contract" | "executable";

export interface VerificationSection {
  readonly mode?: VerificationMode;
  readonly criteria?: readonly string[];
}

export type UiSection = SpecSectionContent;

export interface SpecSections {
  readonly intent?: IntentSection;
  readonly behavior?: BehaviorSection;
  readonly constraints?: readonly ConstraintSection[];
  readonly model?: ModelSection;
  readonly design?: DesignSection;
  readonly decision?: DecisionSection;
  readonly verification?: VerificationSection;
  readonly ui?: UiSection;
}
