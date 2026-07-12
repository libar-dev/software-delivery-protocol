import { parseSlots, stepSkeleton } from "../notation/slots.js";
import type { SlotDeclaredType } from "../notation/slots.js";
import type { GraphEdge, PrimitiveNode } from "./schema.js";

const STEP_PHASES = ["given", "when", "then"] as const;
type StepPhase = (typeof STEP_PHASES)[number];

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asStringArray(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

interface VocabularyStep {
  readonly skeleton: string;
  readonly slotTypes: ReadonlyMap<string, readonly SlotDeclaredType[]>;
  readonly unusableSlots: ReadonlySet<string>;
}

export interface ExampleVocabularyIssue {
  readonly kind: "unmatched" | "incompatible";
  readonly phase: StepPhase;
  readonly skeleton: string;
  readonly parentIds: readonly string[];
}

export interface ExampleVocabularyResolution {
  readonly parentIds: readonly string[];
  readonly issues: readonly ExampleVocabularyIssue[];
}

interface ExampleSpaceIndex {
  readonly primitivesById: ReadonlyMap<string, PrimitiveNode>;
  readonly edgesByFrom: ReadonlyMap<string, readonly GraphEdge[]>;
}

function vocabularySteps(parent: PrimitiveNode): readonly VocabularyStep[] | undefined {
  const behavior = asRecord(parent.sections?.behavior);
  const space = asRecord(behavior?.exampleSpace);

  if (space === undefined) {
    return undefined;
  }

  const steps: VocabularyStep[] = [];

  for (const phase of STEP_PHASES) {
    for (const text of asStringArray(space[phase])) {
      const slotTypes = new Map<string, SlotDeclaredType[]>();
      const unusableSlots = new Set<string>();

      for (const slot of parseSlots(text)) {
        if (slot.form === "typed") {
          slotTypes.set(slot.name, [...(slotTypes.get(slot.name) ?? []), slot.type]);
        } else {
          unusableSlots.add(slot.name);
        }
      }

      steps.push({ skeleton: stepSkeleton(text), slotTypes, unusableSlots });
    }
  }

  return steps;
}

function typeKey(type: SlotDeclaredType): string {
  return JSON.stringify(type);
}

function compatibleWithChild(text: string, matches: readonly VocabularyStep[]): boolean {
  for (const childSlot of parseSlots(text)) {
    if (childSlot.form !== "bound") {
      return false;
    }

    let expectedType: string | undefined;

    for (const match of matches) {
      const declared = match.slotTypes.get(childSlot.name) ?? [];

      if (match.unusableSlots.has(childSlot.name) || declared.length === 0) {
        return false;
      }

      const keys = new Set(declared.map(typeKey));

      if (keys.size !== 1) {
        return false;
      }

      const [key] = keys;

      if (key === undefined) {
        return false;
      }

      if (expectedType === undefined) {
        expectedType = key;
      } else if (expectedType !== key) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Resolve an example's used step skeletons against the example spaces of its direct declared
 * `refines` parents. With no parent space, scalar inference remains available. Once a parent owns
 * a space, every used step must belong to that shared vocabulary.
 */
export function resolveExampleVocabulary(
  node: PrimitiveNode,
  index: ExampleSpaceIndex,
): ExampleVocabularyResolution {
  const parentEntries: VocabularyStep[] = [];
  const parentIds: string[] = [];

  for (const edge of index.edgesByFrom.get(node.id) ?? []) {
    if (edge.type !== "refines" || edge.claim !== "declared") {
      continue;
    }

    const parent = index.primitivesById.get(edge.to);
    const entries = parent === undefined ? undefined : vocabularySteps(parent);

    if (parent !== undefined && entries !== undefined) {
      parentIds.push(parent.id);
      parentEntries.push(...entries);
    }
  }

  parentIds.sort();

  if (parentIds.length === 0) {
    return { parentIds, issues: [] };
  }

  const behavior = asRecord(node.sections?.behavior);
  const examples = Array.isArray(behavior?.examples) ? behavior.examples : [];
  const issues: ExampleVocabularyIssue[] = [];
  const seen = new Set<string>();

  for (const example of examples) {
    const structured = asRecord(example);

    if (structured === undefined) {
      continue;
    }

    for (const phase of STEP_PHASES) {
      for (const text of asStringArray(structured[phase])) {
        const skeleton = stepSkeleton(text);
        const matches = parentEntries.filter((entry) => entry.skeleton === skeleton);
        const kind =
          matches.length === 0
            ? "unmatched"
            : compatibleWithChild(text, matches)
              ? undefined
              : "incompatible";

        if (kind === undefined) {
          continue;
        }

        const key = `${kind}:${phase}:${skeleton}`;

        if (!seen.has(key)) {
          seen.add(key);
          issues.push({ kind, phase, skeleton, parentIds });
        }
      }
    }
  }

  return { parentIds, issues };
}

export function exampleMatchesParentVocabulary(
  node: PrimitiveNode,
  index: ExampleSpaceIndex,
): boolean {
  return resolveExampleVocabulary(node, index).issues.length === 0;
}
