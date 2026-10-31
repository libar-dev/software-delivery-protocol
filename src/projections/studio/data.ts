import type { StudioInputs } from "./inputs.js";
import { studioRecipeAnswers } from "./recipes.js";
import type { StudioRecipeAnswers } from "./recipes.js";
import type { CodeNode, GraphNodeType } from "../../graph/schema.js";
import type { PackContext, Reader, SpecContext } from "../../reader/reader.js";
import { graphReportId } from "../../validate/validators.js";
import type { Finding, ValidationReport } from "../../validate/contracts.js";
import { pagePath } from "./paths.js";

export interface PackTotals {
  readonly members: number;
  readonly unresolved: number;
  readonly heldBelowNextRung: number;
  readonly waitingForAuthor: number;
  readonly entries: number;
  readonly declarations: number;
  readonly openQuestions: number;
  readonly blockingQuestions: number;
  readonly withImplementations: number;
  readonly withReferences: number;
  readonly restsOn: number;
  readonly restedOnBy: number;
  readonly verifiedBy: number;
  readonly supersededBy: number;
}

export interface RailValues {
  readonly packs: readonly {
    readonly id: string;
    readonly title?: string;
    readonly members: readonly {
      readonly id: string;
      readonly title?: string;
      readonly statedReadiness?: string;
      readonly ownsExampleSpace: boolean;
    }[];
  }[];
  readonly findings: { readonly errors: number; readonly warnings: number };
}

export interface SearchEntry {
  readonly section: string;
  readonly entry: string | null;
  readonly key: string | null;
  readonly address: string | null;
  readonly line: number | null;
  readonly text: string;
}

export interface SearchRecord {
  readonly id: string;
  readonly nodeType: GraphNodeType;
  readonly page: string | null;
  readonly title?: string;
  readonly label?: string;
  readonly framing?: string;
  readonly narrative?: string;
  readonly sections?: Record<string, unknown>;
  readonly file?: string;
  readonly line?: number;
  readonly specKind?: string;
  readonly statedReadiness?: string;
  readonly floorReached?: string | null;
  readonly bindings: readonly { readonly edge: string; readonly specId: string }[];
  readonly entries: readonly SearchEntry[];
}

export interface SearchIndex {
  readonly records: readonly SearchRecord[];
}

export interface StudioData {
  readonly recipes: StudioRecipeAnswers;
  readonly inputs: StudioInputs;
  readonly specs: readonly SpecContext[];
  readonly packs: readonly { readonly context: PackContext; readonly totals: PackTotals }[];
  readonly findings: readonly Finding[];
  readonly rail: RailValues;
  readonly search: SearchIndex;
  readonly codeUnits: readonly CodeNode[];
}

export function railValues(reader: Reader): RailValues {
  return {
    packs: reader.packs().map((pack) => ({
      id: pack.id,
      ...(pack.title === undefined ? {} : { title: pack.title }),
      members: (reader.packContext(pack.id)?.members ?? []).map((member) => ({
        id: member.id,
        ...(member.title === undefined ? {} : { title: member.title }),
        ...(member.statedReadiness === undefined
          ? {}
          : { statedReadiness: member.statedReadiness }),
        ownsExampleSpace:
          reader.specContext(member.id)?.sections?.behavior?.exampleSpace !== undefined,
      })),
    })),
    findings: {
      errors: reader.findings().filter((finding) => finding.severity === "error").length,
      warnings: reader.findings().filter((finding) => finding.severity === "warning").length,
    },
  };
}

/** Enumerates recipe 23's walk without a term; matching remains the browser matcher's job. */
function searchEntries(context: SpecContext): readonly SearchEntry[] {
  const entries: SearchEntry[] = [];
  const questions = context.sections?.intent?.openQuestions;
  const questionKeyOf = (entry: string | null): string | null => {
    const index = /^openQuestions\[(\d+)\]\.question$/u.exec(entry ?? "")?.[1];
    const question = index === undefined ? undefined : questions?.[Number(index)];
    const key = typeof question === "object" ? question.key : undefined;
    return typeof key === "string" && /^[a-z][A-Za-z0-9]*$/u.test(key) ? key : null;
  };
  const ruleKeys = context.sections?.behavior?.ruleKeys ?? {};
  const ruleKeyOf = (entry: string | null): string | null =>
    Object.keys(ruleKeys).find((key) => ruleKeys[key] === entry) ?? null;
  const terms = context.sections?.model?.terms ?? {};
  const termKeys = context.sections?.model?.termKeys ?? {};
  const addressOf = (section: string, entry: string | null): string | null => {
    if (section === "model") {
      const key = Object.keys(termKeys).find((key) => `terms.${termKeys[key] ?? ""}` === entry);
      return key === undefined ? null : `${context.id}#term.${key}`;
    }
    if (section === "behavior" || section === "intent") {
      const key = section === "behavior" ? ruleKeyOf(entry) : questionKeyOf(entry);
      return key === null
        ? null
        : `${context.id}#${section === "behavior" ? "rule" : "question"}.${key}`;
    }
    return (section === "design" || section === "ui") &&
      entry !== null &&
      entry !== "description" &&
      /^[a-z][A-Za-z0-9]*$/u.test(entry)
      ? `${context.id}#${section}.${entry}`
      : null;
  };
  const lines = new Map(context.entryLocations.map((location) => [location.entry, location.line]));
  const lineOf = (section: string, entry: string | null, topKey: string | null): number | null => {
    const question =
      /^openQuestions\[(\d+)\](?:\.(question|decider|links|provisional|trigger)(?:\[\d+\])?)?$/u.exec(
        entry ?? "",
      );
    const rule = /^(rules|flows)\[(\d+)\]$/u.exec(entry ?? "");
    const termIndex =
      section === "model" ? Object.keys(terms).findIndex((term) => `terms.${term}` === entry) : -1;
    const located =
      termIndex >= 0
        ? `term[${String(termIndex)}]`
        : section === "intent" && question?.[1] !== undefined
          ? `question[${question[1]}]${question[2] !== undefined && question[2] !== "question" ? `.${question[2]}` : ""}`
          : section === "behavior" && rule !== null
            ? `${rule[1] === "rules" ? "rule" : "flow"}[${rule[2] ?? ""}]`
            : (section === "design" || section === "ui") && topKey !== null
              ? `${section}.${topKey}`
              : null;
    return located === null ? null : (lines.get(located) ?? null);
  };
  const walk = (
    section: string,
    value: unknown,
    entry: string | null,
    key: string | null,
    topKey: string | null,
  ): void => {
    if (typeof value === "string" || key !== null) {
      entries.push({
        section,
        entry,
        key,
        address: addressOf(section, entry),
        line: lineOf(section, entry, topKey),
        text: typeof value === "string" ? value : JSON.stringify(value),
      });
    }
    if (Array.isArray(value)) {
      value.forEach((item: unknown, index) => {
        const path = `${entry ?? ""}[${String(index)}]`;
        walk(section, item, path, section === "behavior" ? ruleKeyOf(path) : null, null);
      });
    } else if (typeof value === "object" && value !== null) {
      const coined =
        section === "design" || section === "ui" || (section === "model" && entry === "terms");
      for (const [name, item] of Object.entries(value)) {
        const path = entry === null ? name : `${entry}.${name}`;
        if (
          section === "behavior" &&
          entry === null &&
          (name === "ruleKeys" || name === "stepKeys")
        )
          continue;
        if (section === "model" && entry === null && name === "termKeys") continue;
        if (section === "intent" && /^openQuestions\[\d+\]\.key$/u.test(path)) continue;
        walk(
          section,
          item,
          path,
          coined && !(entry === null && name === "description")
            ? name
            : section === "intent"
              ? questionKeyOf(path)
              : null,
          entry === null ? name : null,
        );
      }
    }
  };
  if (context.narrative !== undefined) walk("narrative", context.narrative, null, null, null);
  for (const [section, value] of Object.entries(context.sections ?? {}))
    walk(section, value, null, null, null);
  return entries;
}

export function searchIndex(reader: Reader): SearchIndex {
  const specs = new Map(reader.specs().map((spec) => [spec.id, spec]));
  const bindings = new Map<string, { edge: string; specId: string }[]>();
  for (const edge of reader.graph.edges) {
    if (!specs.has(edge.to)) continue;
    const rows = bindings.get(edge.from) ?? [];
    rows.push({ edge: edge.type, specId: edge.to });
    bindings.set(edge.from, rows);
  }
  return {
    records: [...reader.graph.nodes]
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map((node) => {
        const common = {
          id: node.id,
          nodeType: node.nodeType,
          page: pagePath(node.id),
          file: node.file,
        };
        if (node.nodeType === "Primitive") {
          const spec = specs.get(node.id);
          return {
            ...common,
            ...(node.title === undefined ? {} : { title: node.title }),
            ...(node.narrative === undefined ? {} : { narrative: node.narrative }),
            ...(node.sections === undefined
              ? {}
              : { sections: node.sections as Record<string, unknown> }),
            specKind: node.specKind,
            statedReadiness: node.readiness,
            floorReached: spec?.derivedReadiness ?? null,
            bindings: [],
            entries: searchEntries(specContext(reader, node.id)),
          };
        }
        if (node.nodeType === "Pack")
          return {
            ...common,
            ...(node.title === undefined ? {} : { title: node.title }),
            ...(node.framing === undefined ? {} : { framing: node.framing }),
            bindings: [],
            entries: [],
          };
        return {
          ...common,
          ...(node.label === undefined ? {} : { label: node.label }),
          ...(node.line === undefined ? {} : { line: node.line }),
          bindings: bindings.get(node.id) ?? [],
          entries: [],
        };
      }),
  };
}

/** JSON text for the one application/json element, safe even for carrier text containing tags. */
export function embedData(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function specContext(reader: Reader, id: string): SpecContext {
  const context = reader.specContext(id);
  if (context === undefined) throw new Error(`Studio cannot resolve Spec ${id}`);
  return context;
}

/**
 * @sdpAnchor impl:protocol.studio-data
 * @sdpLabel assembles reader contexts, Pack totals, rails and search records for static pages
 * @sdpSatisfies spec:consumers.spec-studio.data, spec:consumers.spec-studio
 * @sdpComponent component:protocol.projections
 * @sdpRole contract
 */
export async function createStudioData(
  source: Reader,
  report: ValidationReport = { validatorId: graphReportId, findings: source.findings() },
  inputs: StudioInputs = { runs: [] },
): Promise<StudioData> {
  // Studio owns these values for one build and shares their joins across shipped recipes.
  const specRows = source.specs(),
    packRows = source.packs();
  const specContexts = new Map<string, SpecContext | undefined>();
  const packContexts = new Map<string, PackContext | undefined>();
  const reader: Reader = {
    ...source,
    specs: () => specRows,
    packs: () => packRows,
    specContext: (id) => {
      if (!specContexts.has(id)) specContexts.set(id, source.specContext(id));
      return specContexts.get(id);
    },
    packContext: (id) => {
      if (!packContexts.has(id)) packContexts.set(id, source.packContext(id));
      return packContexts.get(id);
    },
  };
  const recipes = await studioRecipeAnswers(reader, report, inputs);
  return {
    recipes,
    inputs,
    specs: reader.specs().map((spec) => specContext(reader, spec.id)),
    packs: reader.packs().map((pack) => {
      const context = reader.packContext(pack.id);
      if (context === undefined) throw new Error(`Studio cannot resolve Pack ${pack.id}`);
      return { context, totals: (recipes.packs.get(pack.id) as { totals: PackTotals }).totals };
    }),
    findings: reader.findings(),
    rail: railValues(reader),
    search: searchIndex(reader),
    codeUnits: reader.graph.nodes.filter((node): node is CodeNode => node.nodeType === "CodeNode"),
  };
}
