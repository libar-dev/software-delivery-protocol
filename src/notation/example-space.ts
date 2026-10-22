import type { GraphSchema, PrimitiveNode } from "../graph/schema.js";
import type { Finding } from "../validate/contracts.js";
import { parseSlots, stepSkeleton } from "./slots.js";
import type { SlotDeclaredType, SlotScalar } from "./slots.js";
export const contractsFindingIds = {
  /** A child binds a slot name its parent's example space never declares. */
  undeclaredSlot: "contracts/undeclared-slot",
  /** A bound value does not fit the slot's declared type (off a closed union, wrong scalar). */
  offDimensionValue: "contracts/off-dimension-value",
  /** One example binds the same step skeleton twice with different values — first wins. */
  conflictingBinding: "contracts/conflicting-binding",
  /** Two vocabulary steps declare the same slot name at different types — first wins. */
  conflictingDimension: "contracts/conflicting-dimension",
  /** A vocabulary slot group that declares no usable type (bare, malformed, non-string value). */
  untypedVocabularySlot: "contracts/untyped-vocabulary-slot",
  /** An example carries more than one structured entry — only the point entry is executable. */
  multiEntryExample: "contracts/multi-entry-example",
  /** A child step does not resolve compatibly against an existing parent example space. */
  unmatchedVocabularyStep: "contracts/unmatched-vocabulary-step",
  /** Two contract paths differ only by letter case — they cannot coexist on a case-insensitive
   *  filesystem, so the contracts tree is withheld WHOLE (the emitted artifact is all-or-nothing
   *  — a partial tree reading as current would be its own dishonesty) and the warning names the
   *  colliding pair; gating stays `validateGraph`'s alone (MD-14). */
  caseCollidingPath: "contracts/case-colliding-path",
  /** More than one authored suite claims the registrar path for one example. */
  multipleRegistrarPaths: "contracts/multiple-registrar-paths",
  conflictingStepKey: "contracts/conflicting-step-key",
  duplicateStepKey: "contracts/duplicate-step-key",
} as const;

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

export function asStringArray(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

export const STEP_PHASES = ["given", "when", "then"] as const;
export type StepPhase = (typeof STEP_PHASES)[number];

export interface StructuredEntry {
  readonly given: readonly string[];
  readonly when: readonly string[];
  readonly then: readonly string[];
}

export function structuredEntriesOf(node: PrimitiveNode): readonly StructuredEntry[] {
  const behavior = asRecord(node.sections?.behavior);
  const entries = Array.isArray(behavior?.examples) ? behavior.examples : [];
  const structured: StructuredEntry[] = [];

  for (const entry of entries) {
    const record = asRecord(entry);

    if (record === undefined) {
      continue;
    }

    structured.push({
      given: asStringArray(record.given),
      when: asStringArray(record.when),
      then: asStringArray(record.then),
    });
  }

  return structured;
}

export interface VocabularyEntry {
  readonly key: string;
  readonly stepKey?: string;
  readonly phase: StepPhase;
  readonly skeleton: string;
  /** Slot name → declared type, authored order. Only the ratified type-form declares (`number` /
   *  `string` / `boolean` / a closed union of two or more quoted literals). Every other
   *  identifier-led form, bare, malformed, or a value-form binding, declares nothing and warns
   *  (`contracts/untyped-vocabulary-slot`), never silently drops (L2). */
  readonly slots: ReadonlyMap<string, SlotDeclaredType>;
}

export function authoredStepKey(node: PrimitiveNode, skeleton: string): string | undefined {
  return Object.entries(node.sections?.behavior?.stepKeys ?? {}).find(
    ([, target]) => target === skeleton,
  )?.[0];
}

export function duplicateContractKeys(
  steps: readonly { readonly key: string; readonly skeleton: string }[],
  node: PrimitiveNode,
  kind: "space" | "step",
  findings: Finding[],
): boolean {
  const first = new Map<string, string>();
  let duplicate = false;
  for (const step of steps) {
    const previous = first.get(step.key);
    if (previous !== undefined && previous !== step.skeleton) {
      duplicate = true;
      findings.push(
        contractsFinding(
          contractsFindingIds.duplicateStepKey,
          `contract key "${step.key}" names both "${previous}" and "${step.skeleton}"; ${kind} contract withheld`,
          node,
          kind === "space" ? "behavior.exampleSpace" : "behavior.examples",
        ),
      );
    } else first.set(step.key, step.skeleton);
  }
  return duplicate;
}

export function vocabularyOf(
  node: PrimitiveNode,
  findings: Finding[],
): readonly VocabularyEntry[] | undefined {
  const behavior = asRecord(node.sections?.behavior);
  const space = asRecord(behavior?.exampleSpace);

  if (space === undefined) {
    return undefined;
  }

  const entries: VocabularyEntry[] = [];

  for (const phase of STEP_PHASES) {
    for (const text of asStringArray(space[phase])) {
      const slots = new Map<string, SlotDeclaredType>();
      const skeleton = stepSkeleton(text);

      for (const slot of parseSlots(text)) {
        if (slot.form === "typed") {
          const existing = slots.get(slot.name);

          if (existing === undefined) {
            slots.set(slot.name, slot.type);
          } else if (!sameType(existing, slot.type)) {
            findings.push(
              contractsFinding(
                contractsFindingIds.conflictingDimension,
                `slot "{${slot.name}}" is declared at type ${typeExpression(slot.type)} after ${typeExpression(existing)} within one vocabulary step ("${skeleton}") — the first declaration wins (ambiguity is loud, L2)`,
                node,
                "behavior.exampleSpace",
              ),
            );
          }
          continue;
        }

        // A value-form group binds one value and declares no dimension, even in a vocabulary.
        // Keep the parent visible in the warning so the undeclared slot cannot silently vanish.
        findings.push(
          contractsFinding(
            contractsFindingIds.untypedVocabularySlot,
            `vocabulary step "${skeleton}" carries slot "{${slot.name}}" without a usable type declaration — a dimension declares number/string/boolean or a closed union of two or more quoted literals; the slot declares nothing`,
            node,
            "behavior.exampleSpace",
          ),
        );
      }

      entries.push({
        phase,
        skeleton,
        slots,
        key: authoredStepKey(node, skeleton) ?? skeleton,
        stepKey: authoredStepKey(node, skeleton),
      });
    }
  }

  return entries;
}

export function typeExpression(type: SlotDeclaredType): string {
  return type.kind === "enum"
    ? type.values.map((value) => JSON.stringify(value)).join(" | ")
    : type.kind;
}

export function valueExpression(value: SlotScalar): string {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

export function scalarKind(value: SlotScalar): "number" | "string" | "boolean" {
  return typeof value === "number" ? "number" : typeof value === "string" ? "string" : "boolean";
}

export function valueFitsType(value: SlotScalar, type: SlotDeclaredType): boolean {
  if (type.kind === "enum") {
    return typeof value === "string" && type.values.includes(value);
  }

  return scalarKind(value) === type.kind;
}

export function sameType(left: SlotDeclaredType, right: SlotDeclaredType): boolean {
  return typeExpression(left) === typeExpression(right);
}

/* ----- findings ----- */

export function contractsFinding(
  validatorId: string,
  message: string,
  node: PrimitiveNode,
  path: string,
): Finding {
  return {
    validatorId,
    family: "conformance",
    severity: "warning",
    message,
    subjectId: node.id,
    path,
    file: node.file,
  };
}

/* ----- the space contract ----- */

export interface Dimension {
  readonly name: string;
  readonly type: SlotDeclaredType;
  /** The skeleton of the first vocabulary step declaring the slot — the deterministic label. */
  readonly label: string;
}

export interface SpaceModel {
  readonly parent: PrimitiveNode;
  readonly dimensions: readonly Dimension[];
  /** Skeleton → vocabulary entry (first per skeleton, given → when → then). */
  readonly bySkeleton: ReadonlyMap<string, VocabularyEntry>;
  readonly thenEntries: readonly VocabularyEntry[];
}

export function buildSpaceModel(
  parent: PrimitiveNode,
  vocabulary: readonly VocabularyEntry[],
  findings: Finding[],
): SpaceModel {
  const dimensions: Dimension[] = [];
  const byName = new Map<string, Dimension>();
  const bySkeleton = new Map<string, VocabularyEntry>();

  for (const entry of vocabulary) {
    if (!bySkeleton.has(entry.skeleton)) {
      bySkeleton.set(entry.skeleton, entry);
    }

    if (entry.phase === "then") {
      continue;
    }

    for (const [name, type] of entry.slots) {
      const existing = byName.get(name);

      if (existing === undefined) {
        const dimension = { name, type, label: entry.skeleton };
        byName.set(name, dimension);
        dimensions.push(dimension);
        continue;
      }

      if (!sameType(existing.type, type)) {
        findings.push(
          contractsFinding(
            contractsFindingIds.conflictingDimension,
            `slot "{${name}}" is declared at type ${typeExpression(type)} in "${entry.skeleton}" but already at ${typeExpression(existing.type)} in "${existing.label}" — the first declaration wins (ambiguity is loud, L2)`,
            parent,
            "behavior.exampleSpace",
          ),
        );
      }
    }
  }

  return {
    parent,
    dimensions,
    bySkeleton,
    thenEntries: vocabulary.filter((entry) => entry.phase === "then"),
  };
}

export interface ExamplePointModel {
  readonly spec: string;
  /** Dimension name → bound value, in dimension order. */
  readonly point: ReadonlyMap<string, SlotScalar>;
}

/**
 * A child's bound point: the first binding per slot name from the child's point entry — the SAME
 * entry the step contract derives from (`pointEntryOf`), so point and contract can never mix
 * cases — filtered to the parent's declared dimensions. An undeclared or off-type binding warns
 * and drops (the generated artifact always compiles; the drift is named here instead).
 */
export function bindPoint(
  space: SpaceModel,
  child: PrimitiveNode,
  findings: Finding[],
): ExamplePointModel {
  const bound = new Map<string, SlotScalar>();
  const flagged = new Set<string>();
  const dimensionByName = new Map(space.dimensions.map((dimension) => [dimension.name, dimension]));
  const pointEntry = pointEntryOf(child);

  for (const entry of pointEntry === undefined ? [] : [pointEntry]) {
    for (const phase of STEP_PHASES) {
      for (const text of entry[phase]) {
        for (const slot of parseSlots(text)) {
          if (slot.form !== "bound" || flagged.has(slot.name)) {
            continue;
          }

          const dimension = dimensionByName.get(slot.name);

          if (dimension === undefined) {
            // Then-vocabulary slots are outcome payload, not dimensions — a binding for one is
            // ordinary (the outcome point), so only names foreign to the whole vocabulary warn.
            if (!vocabularyDeclaresSlot(space, slot.name)) {
              findings.push(
                contractsFinding(
                  contractsFindingIds.undeclaredSlot,
                  `bound slot "{${slot.name}}" is not declared in the parent's example space ("${space.parent.id}") — the binding is dropped from the point`,
                  child,
                  "behavior.examples",
                ),
              );
              flagged.add(slot.name);
            }
            continue;
          }

          const existing = bound.get(slot.name);

          if (existing !== undefined) {
            if (existing !== slot.value) {
              findings.push(
                contractsFinding(
                  contractsFindingIds.conflictingBinding,
                  `slot "{${slot.name}}" is bound to ${valueExpression(slot.value)} after ${valueExpression(existing)} in the same example — the first binding wins (an example is one point, MD-17)`,
                  child,
                  "behavior.examples",
                ),
              );
              flagged.add(slot.name);
            }
            continue;
          }

          if (!valueFitsType(slot.value, dimension.type)) {
            findings.push(
              contractsFinding(
                contractsFindingIds.offDimensionValue,
                `slot "{${slot.name}}" binds ${valueExpression(slot.value)}, outside its declared type ${typeExpression(dimension.type)} — the binding is dropped from the point`,
                child,
                "behavior.examples",
              ),
            );
            flagged.add(slot.name);
            continue;
          }

          bound.set(slot.name, slot.value);
        }
      }
    }
  }

  const point = new Map<string, SlotScalar>();

  for (const dimension of space.dimensions) {
    const value = bound.get(dimension.name);

    if (value !== undefined) {
      point.set(dimension.name, value);
    }
  }

  return { spec: child.id, point };
}

function vocabularyDeclaresSlot(space: SpaceModel, name: string): boolean {
  for (const entry of space.bySkeleton.values()) {
    if (entry.slots.has(name)) {
      return true;
    }
  }

  return false;
}

export function isCompleteEntry(entry: StructuredEntry): boolean {
  return entry.given.length > 0 && entry.when.length > 0 && entry.then.length > 0;
}

/**
 * THE entry an example derives from — the first complete structured entry (falling back to the
 * first structured entry when none is complete): the one place the step contract AND the bound
 * point read, so the two artifacts can never mix cases across entries (one point per example,
 * MD-17; entries beyond the first are the loud `multi-entry-example` degradation).
 */
export function pointEntryOf(node: PrimitiveNode): StructuredEntry | undefined {
  const entries = structuredEntriesOf(node);

  return entries.find(isCompleteEntry) ?? entries[0];
}

export interface ExampleSlot {
  readonly name: string;
  readonly type: "number" | "string" | "boolean" | "enum";
  readonly values?: readonly string[];
  readonly step: string;
}
export interface BoundPoint {
  readonly example: string;
  readonly values: Readonly<Record<string, SlotScalar>>;
}
export interface DecodedExampleSpace {
  readonly slots: readonly ExampleSlot[];
  readonly points: readonly BoundPoint[];
}
const cache = new WeakMap<GraphSchema, ReturnType<typeof decode>>();
function decode(graph: GraphSchema) {
  const findings: Finding[] = [];
  const spaces = new Map<string, SpaceModel>();
  const points = new Map<string, readonly ExamplePointModel[]>();
  const withheldSpaces = new Set<string>();
  const contexts = new Map<string, DecodedExampleSpace>();
  const nodes = graph.nodes
    .filter((node): node is PrimitiveNode => node.nodeType === "Primitive")
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (const parent of nodes) {
    const vocabulary = vocabularyOf(parent, findings);
    if (vocabulary === undefined) continue;
    const space = buildSpaceModel(parent, vocabulary, findings);
    if (duplicateContractKeys(vocabulary, parent, "space", findings)) withheldSpaces.add(parent.id);
    spaces.set(parent.id, space);
    const children = new Set(
      graph.edges
        .filter((e) => e.type === "refines" && e.claim === "declared" && e.to === parent.id)
        .map((e) => e.from),
    );
    const bound = nodes
      .filter(
        (child) =>
          child.specKind === "example" &&
          children.has(child.id) &&
          structuredEntriesOf(child).length > 0,
      )
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map((child) => bindPoint(space, child, findings));
    points.set(parent.id, bound);
    contexts.set(parent.id, {
      slots: space.dimensions.map((d) => ({
        name: d.name,
        type: d.type.kind,
        ...(d.type.kind === "enum" ? { values: d.type.values } : {}),
        step: d.label,
      })),
      points: bound.map((p) => ({ example: p.spec, values: Object.fromEntries(p.point) })),
    });
  }
  return { spaces, points, contexts, findings, withheldSpaces };
}
/**
 * @sdpAnchor impl:protocol.example-space-decoding
 * @sdpLabel shared example-space interpretation for contracts and reader contexts
 * @sdpSatisfies spec:consumers.agent-surface.example-space-coverage, spec:carrier.step-keys
 * @sdpComponent component:protocol.notation
 * @sdpRole codec
 */
export function decodeExampleSpaces(graph: GraphSchema): ReturnType<typeof decode> {
  let result = cache.get(graph);
  if (result === undefined) {
    result = decode(graph);
    cache.set(graph, result);
  }
  return result;
}
