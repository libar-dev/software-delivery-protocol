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

export type SpecSectionContent = Record<string, unknown>;

export type IntentSection = SpecSectionContent;
export type BehaviorSection = SpecSectionContent;
export type ConstraintsSection = SpecSectionContent;
export type ModelSection = SpecSectionContent;
export type DesignSection = SpecSectionContent;
export type DecisionSection = SpecSectionContent;
export type VerificationSection = SpecSectionContent;
export type UiSection = SpecSectionContent;

export interface SpecSections {
  readonly intent?: IntentSection;
  readonly behavior?: BehaviorSection;
  readonly constraints?: ConstraintsSection;
  readonly model?: ModelSection;
  readonly design?: DesignSection;
  readonly decision?: DecisionSection;
  readonly verification?: VerificationSection;
  readonly ui?: UiSection;
}
