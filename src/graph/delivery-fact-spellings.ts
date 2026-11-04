import { deliveryFactNames } from "./schema.js";
import type { DeliveryFactName } from "./schema.js";

/** Authored carriers reserve graph names and camelCase spellings without regard to case. */
export const deliveryFactSpellings = [...deliveryFactNames, "hasVerifier"] as const;

const factMatchers = deliveryFactSpellings.map((spelling) => ({
  name: spelling === "hasVerifier" ? ("has-verifier" as const) : spelling,
  pattern: new RegExp(`^${spelling}$`, "iu"),
}));

export function deliveryFactName(name: string): DeliveryFactName | undefined {
  return factMatchers.find(({ pattern }) => pattern.test(name))?.name;
}

const derivedProperties = new Set([
  "claim",
  "nodeType",
  "specKind",
  "satisfies",
  "verifies",
  "belongsTo",
  "models",
]);

export function isDeliveryFactProperty(name: string): boolean {
  return deliveryFactName(name) !== undefined || /^deliveryFacts$/iu.test(name);
}

/** Only carrier-level keys are reserved; nested content may name these concepts. */
export function isReservedDerivedProperty(name: string): boolean {
  return isDeliveryFactProperty(name) || derivedProperties.has(name);
}

const factTagPattern = new RegExp(
  `^@(${[...deliveryFactSpellings, "deliveryFacts"].join("|")})(?=$|[.-])`,
  "iu",
);

/** Gherkin permits dot and hyphen suffixes after a reserved tag head. */
export function isDeliveryFactTag(name: string): boolean {
  return factTagPattern.test(name);
}
