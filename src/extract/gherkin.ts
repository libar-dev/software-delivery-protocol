import { generateMessages } from "@cucumber/gherkin";
import {
  IdGenerator,
  SourceMediaType,
  StepKeywordType,
  type Feature,
  type Rule,
  type Scenario,
  type Step,
  type Tag,
} from "@cucumber/messages";

import { parseId } from "../ids.js";
import type { SpecAltitude, SpecReadiness } from "../model/descriptors.js";
import type { SpecRelationType } from "../model/relations.js";
import type { Finding } from "../validate/contracts.js";
import type { CarrierReification } from "./carrier.js";
import { extractFindingIds, type ReifiedSpec } from "./reify.js";

const GHERKIN_RELATION_TAGS = {
  refines: "refines",
  "depends-on": "dependsOn",
  "constrained-by": "constrainedBy",
  "decided-by": "decidedBy",
  verifies: "verifies",
} as const satisfies Record<string, Exclude<SpecRelationType, "supersedes">>;

type GherkinRelationType = (typeof GHERKIN_RELATION_TAGS)[keyof typeof GHERKIN_RELATION_TAGS];

interface ReifiedRelation {
  readonly type: GherkinRelationType;
  readonly target: string;
  readonly claim: "declared";
}

const RESERVED_TAG_HEADS = [
  "spec",
  "altitude",
  "readiness",
  "refines",
  "depends-on",
  "constrained-by",
  "decided-by",
  "verifies",
  "kind",
  "pack",
  "supersedes",
  "example-space",
] as const;

const DESCRIPTION_KEYS = [
  "problem",
  "outcome",
  "value",
  "actor",
  "description",
  "risk",
  "assumption",
  "criterion",
  "verification-mode",
] as const;

const SINGULAR_INTENT_KEYS: Readonly<Record<string, true>> = {
  problem: true,
  outcome: true,
  value: true,
  actor: true,
  description: true,
};
const ALTITUDES: Readonly<Record<string, true>> = {
  epic: true,
  feature: true,
  story: true,
};
const READINESS: Readonly<Record<string, true>> = {
  idea: true,
  scoped: true,
  defined: true,
  ready: true,
};
const VERIFICATION_MODES: Readonly<Record<string, true>> = {
  manual: true,
  reviewed: true,
  contract: true,
  executable: true,
};
const HEADING_SHAPED_LINE = /^[A-Z][^:]*:\s*$/u;
const KEYED_LINE = /^- ([^:]+):\s*(.*)$/u;
const LANGUAGE_HEADER = /^\s*#\s*language:\s*([^\s#]+).*$/u;

interface DescriptionSections {
  readonly intent?: Record<string, unknown>;
  readonly verification?: Record<string, unknown>;
  readonly narrative?: string;
}

interface ParsedMetadata {
  readonly id: string;
  readonly idLine: number;
  readonly altitude: SpecAltitude;
  readonly readiness: SpecReadiness;
  readonly relations: readonly ReifiedRelation[];
}

type ParseResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly finding: Finding };

function finding(
  validatorId: string,
  message: string,
  file: string,
  line: number,
  subjectId?: string,
): Finding {
  return {
    validatorId,
    family: "conformance",
    severity: "error",
    message,
    subjectId,
    file,
    line,
  };
}

function grammarFinding(file: string, line: number, message: string, subjectId?: string): Finding {
  return finding(extractFindingIds.gherkinGrammar, message, file, line, subjectId);
}

function invalidIdFinding(file: string, line: number, token: string, reason: string): Finding {
  return finding(
    extractFindingIds.invalidId,
    `Gherkin id token "${token}" is invalid: ${reason}`,
    file,
    line,
  );
}

function levenshtein(left: string, right: string): number {
  if (left === right) return 0;
  if (left.length === 0) return right.length;
  if (right.length === 0) return left.length;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  let current = new Array<number>(right.length + 1);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = previous[rightIndex - 1] ?? 0;
      current[rightIndex] = Math.min(
        (previous[rightIndex] ?? 0) + 1,
        (current[rightIndex - 1] ?? 0) + 1,
        substitution + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    [previous, current] = [current, previous];
  }

  return previous[right.length] ?? Math.max(left.length, right.length);
}

function nearest(value: string, candidates: readonly string[]): string | undefined {
  let winner: string | undefined;
  let distance = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const candidateDistance = levenshtein(value, candidate);
    if (candidateDistance < distance) {
      winner = candidate;
      distance = candidateDistance;
    }
  }

  return distance <= 2 ? winner : undefined;
}

function tagHead(tagName: string): string {
  const body = tagName.startsWith("@") ? tagName.slice(1) : tagName;
  const dot = body.indexOf(".");
  return dot === -1 ? body : body.slice(0, dot);
}

function authoredFactReason(name: string): string | undefined {
  if (name === "@implemented" || name === "@has-verifier" || name === "@observed") {
    return "delivery-fact lookalike";
  }
  if (name.startsWith("@claim")) return "authored claim lookalike";
  if (name.startsWith("@status-")) return "authored lifecycle-status lookalike";
  if (name.startsWith("@architect-")) return "retired architect-status lookalike";
  return undefined;
}

function decorationTagFinding(tag: Tag, file: string): Finding | undefined {
  const name = tag.name;
  const factReason = authoredFactReason(name);
  if (factReason !== undefined) {
    return grammarFinding(
      file,
      tag.location.line,
      `Gherkin tag "${name}" is refused as an ${factReason}; delivery facts, claims, and lifecycle state are never authored by the carrier`,
    );
  }

  if (name.startsWith("@kind.")) {
    return grammarFinding(
      file,
      tag.location.line,
      `Gherkin tag "${name}" is refused: kind is structural (Feature → behavior, Scenario → example)`,
    );
  }
  if (name === "@pack" || name.startsWith("@pack.")) {
    return grammarFinding(
      file,
      tag.location.line,
      `Gherkin tag "${name}" is refused: Pack membership is owned only by the Pack manifest`,
    );
  }
  if (name.startsWith("@supersedes.")) {
    return grammarFinding(
      file,
      tag.location.line,
      `Gherkin tag "${name}" is refused: supersedes is outside the behavior/example carrier vocabulary`,
    );
  }

  const head = tagHead(name);
  const suggestion = nearest(head, RESERVED_TAG_HEADS);
  if (suggestion !== undefined) {
    return grammarFinding(
      file,
      tag.location.line,
      `Gherkin decoration tag "${name}" is too close to reserved graph-aware head "${head}"; did you mean "@${suggestion}."?`,
    );
  }

  return undefined;
}

function parseSpecIdToken(
  fullId: string,
  token: string,
  file: string,
  line: number,
): ParseResult<string> {
  try {
    const parsed = parseId(fullId);
    if (parsed.namespace !== "spec") {
      return {
        ok: false,
        finding: invalidIdFinding(file, line, token, "the target must use the spec: namespace"),
      };
    }
    return { ok: true, value: fullId };
  } catch (error: unknown) {
    return {
      ok: false,
      finding: invalidIdFinding(
        file,
        line,
        token,
        error instanceof Error ? error.message : "an unknown value was thrown",
      ),
    };
  }
}

function parseMetadataTags(
  tags: readonly Tag[],
  file: string,
  keywordLine: number,
  construct: "Feature" | "Scenario",
): ParseResult<ParsedMetadata> {
  let id: string | undefined;
  let idLine = keywordLine;
  let altitude: SpecAltitude | undefined;
  let readiness: SpecReadiness | undefined;
  const relations: ReifiedRelation[] = [];

  for (const tag of tags) {
    const name = tag.name;
    if (name.startsWith("@spec.")) {
      if (id !== undefined) {
        return {
          ok: false,
          finding: grammarFinding(
            file,
            tag.location.line,
            `${construct} carries duplicate identity tag "${name}"; exactly one @spec.<dotted-id> is required`,
            id,
          ),
        };
      }
      const parsed = parseSpecIdToken(
        `spec:${name.slice("@spec.".length)}`,
        name,
        file,
        tag.location.line,
      );
      if (!parsed.ok) return parsed;
      id = parsed.value;
      idLine = tag.location.line;
      continue;
    }

    if (name.startsWith("@altitude.")) {
      if (altitude !== undefined) {
        return {
          ok: false,
          finding: grammarFinding(
            file,
            tag.location.line,
            `${construct} carries duplicate altitude tag "${name}"; exactly one altitude is required`,
            id,
          ),
        };
      }
      const value = name.slice("@altitude.".length);
      if (ALTITUDES[value] !== true) {
        return {
          ok: false,
          finding: grammarFinding(
            file,
            tag.location.line,
            `${construct} altitude tag "${name}" is outside epic | feature | story`,
            id,
          ),
        };
      }
      altitude = value as SpecAltitude;
      continue;
    }

    if (name.startsWith("@readiness.")) {
      if (readiness !== undefined) {
        return {
          ok: false,
          finding: grammarFinding(
            file,
            tag.location.line,
            `${construct} carries duplicate readiness tag "${name}"; exactly one readiness is required`,
            id,
          ),
        };
      }
      const value = name.slice("@readiness.".length);
      if (READINESS[value] !== true) {
        return {
          ok: false,
          finding: grammarFinding(
            file,
            tag.location.line,
            `${construct} readiness tag "${name}" is outside idea | scoped | defined | ready`,
            id,
          ),
        };
      }
      readiness = value as SpecReadiness;
      continue;
    }

    let relationMatched = false;
    for (const [head, relationType] of Object.entries(GHERKIN_RELATION_TAGS)) {
      const prefix = `@${head}.`;
      if (!name.startsWith(prefix)) continue;
      relationMatched = true;
      const targetToken = name.slice(prefix.length);
      const parsed = parseSpecIdToken(targetToken, name, file, tag.location.line);
      if (!parsed.ok) return parsed;
      relations.push({ type: relationType, target: parsed.value, claim: "declared" });
      break;
    }
    if (relationMatched) continue;

    if (name === "@example-space") {
      return {
        ok: false,
        finding: grammarFinding(
          file,
          tag.location.line,
          `${construct} tag "@example-space" is lawful only on the single pseudo-scenario`,
          id,
        ),
      };
    }

    const refusedDecoration = decorationTagFinding(tag, file);
    if (refusedDecoration !== undefined) return { ok: false, finding: refusedDecoration };
  }

  if (id === undefined) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        keywordLine,
        `${construct} is missing @spec.<dotted-id>; exactly one identity tag is required`,
      ),
    };
  }
  if (altitude === undefined) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        keywordLine,
        `${construct} "${id}" is missing @altitude.epic|feature|story`,
        id,
      ),
    };
  }
  if (readiness === undefined) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        keywordLine,
        `${construct} "${id}" is missing @readiness.idea|scoped|defined|ready`,
        id,
      ),
    };
  }

  return { ok: true, value: { id, idLine, altitude, readiness, relations } };
}

function normalizeNarrative(lines: readonly string[]): string | undefined {
  const paragraphs: string[] = [];
  let paragraph: string[] = [];

  for (const line of lines) {
    if (line.length === 0) {
      if (paragraph.length > 0) paragraphs.push(paragraph.join(" "));
      paragraph = [];
    } else {
      paragraph.push(line);
    }
  }
  if (paragraph.length > 0) paragraphs.push(paragraph.join(" "));

  const narrative = paragraphs.join("\n\n");
  return narrative.length === 0 ? undefined : narrative;
}

function parseDescription(
  description: string,
  file: string,
  firstLine: number,
  construct: string,
  subjectId?: string,
): ParseResult<DescriptionSections> {
  const intent: Record<string, unknown> = {};
  const verification: Record<string, unknown> = {};
  const risks: string[] = [];
  const assumptions: string[] = [];
  const criteria: string[] = [];
  const singular = new Set<string>();
  const narrativeLines: string[] = [];
  const lines = description.split(/\r?\n/u).map((line) => line.trim());

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const lineNumber = firstLine + index;
    const keyed = KEYED_LINE.exec(line);

    if (keyed !== null) {
      const key = (keyed[1] ?? "").trim();
      const value = keyed[2] ?? "";
      if (!DESCRIPTION_KEYS.includes(key as (typeof DESCRIPTION_KEYS)[number])) {
        const suggestion = nearest(key, DESCRIPTION_KEYS);
        return {
          ok: false,
          finding: grammarFinding(
            file,
            lineNumber,
            `${construct} description key "${key}" is outside the closed set ${DESCRIPTION_KEYS.join(" | ")}${suggestion === undefined ? "" : `; did you mean "${suggestion}"?`}`,
            subjectId,
          ),
        };
      }
      if (value.length === 0) {
        return {
          ok: false,
          finding: grammarFinding(
            file,
            lineNumber,
            `${construct} description key "${key}" requires a value`,
            subjectId,
          ),
        };
      }
      if (SINGULAR_INTENT_KEYS[key] === true) {
        if (singular.has(key)) {
          return {
            ok: false,
            finding: grammarFinding(
              file,
              lineNumber,
              `${construct} description key "${key}" is authored more than once`,
              subjectId,
            ),
          };
        }
        singular.add(key);
        intent[key] = value;
      } else if (key === "risk") {
        risks.push(value);
      } else if (key === "assumption") {
        assumptions.push(value);
      } else if (key === "criterion") {
        criteria.push(value);
      } else if (key === "verification-mode") {
        if (VERIFICATION_MODES[value] !== true) {
          return {
            ok: false,
            finding: grammarFinding(
              file,
              lineNumber,
              `${construct} verification mode "${value}" is outside manual | reviewed | contract | executable`,
              subjectId,
            ),
          };
        }
        if (verification.mode !== undefined) {
          return {
            ok: false,
            finding: grammarFinding(
              file,
              lineNumber,
              `${construct} description key "verification-mode" is authored more than once`,
              subjectId,
            ),
          };
        }
        verification.mode = value;
      }
      continue;
    }

    if (HEADING_SHAPED_LINE.test(line)) {
      return {
        ok: false,
        finding: grammarFinding(
          file,
          lineNumber,
          `${construct} description line "${line}" is heading-shaped; the Gherkin carrier has no description headings`,
          subjectId,
        ),
      };
    }
    narrativeLines.push(line);
  }

  if (risks.length > 0) intent.risks = risks;
  if (assumptions.length > 0) intent.assumptions = assumptions;
  if (criteria.length > 0) verification.criteria = criteria;

  const narrative = normalizeNarrative(narrativeLines);
  return {
    ok: true,
    value: {
      ...(Object.keys(intent).length === 0 ? {} : { intent }),
      ...(Object.keys(verification).length === 0 ? {} : { verification }),
      ...(narrative === undefined ? {} : { narrative }),
    },
  };
}

function parseSteps(
  steps: readonly Step[],
  file: string,
  construct: string,
  subjectId?: string,
): ParseResult<{ readonly given: string[]; readonly when: string[]; readonly then: string[] }> {
  const parsed = { given: [] as string[], when: [] as string[], then: [] as string[] };
  let previous: "given" | "when" | "then" | undefined;

  for (const step of steps) {
    if (step.docString !== undefined) {
      return {
        ok: false,
        finding: grammarFinding(
          file,
          step.docString.location.line,
          `${construct} step "${step.text}" carries a doc string, which the closed carrier grammar refuses`,
          subjectId,
        ),
      };
    }
    if (step.dataTable !== undefined) {
      return {
        ok: false,
        finding: grammarFinding(
          file,
          step.dataTable.location.line,
          `${construct} step "${step.text}" carries a data table, which the closed carrier grammar refuses`,
          subjectId,
        ),
      };
    }

    let phase: "given" | "when" | "then" | undefined;
    switch (step.keywordType) {
      case StepKeywordType.CONTEXT:
        phase = "given";
        break;
      case StepKeywordType.ACTION:
        phase = "when";
        break;
      case StepKeywordType.OUTCOME:
        phase = "then";
        break;
      case StepKeywordType.CONJUNCTION:
        if (previous === undefined) {
          return {
            ok: false,
            finding: grammarFinding(
              file,
              step.location.line,
              `${construct} starts with conjunction step "${step.keyword.trim()} ${step.text}"; And/But must inherit a preceding phase`,
              subjectId,
            ),
          };
        }
        phase = previous;
        break;
      default:
        return {
          ok: false,
          finding: grammarFinding(
            file,
            step.location.line,
            `${construct} step keyword "${step.keyword.trim()}" is refused; '*' and unknown step phases have no carrier meaning`,
            subjectId,
          ),
        };
    }

    parsed[phase].push(step.text);
    previous = phase;
  }

  return { ok: true, value: parsed };
}

function parseExampleSpaceScenario(
  scenario: Scenario,
  file: string,
): ParseResult<{ readonly given: string[]; readonly when: string[]; readonly then: string[] }> {
  const markers = scenario.tags.filter((tag) => tag.name === "@example-space");
  if (markers.length !== 1) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        markers[1]?.location.line ?? scenario.location.line,
        `@example-space pseudo-scenario carries ${String(markers.length)} marker tags; exactly one is required`,
      ),
    };
  }

  for (const tag of scenario.tags) {
    if (tag.name === "@example-space") continue;
    const refused = decorationTagFinding(tag, file);
    if (refused !== undefined) return { ok: false, finding: refused };

    const head = tagHead(tag.name);
    if (
      RESERVED_TAG_HEADS.includes(head as (typeof RESERVED_TAG_HEADS)[number]) ||
      authoredFactReason(tag.name) !== undefined
    ) {
      return {
        ok: false,
        finding: grammarFinding(
          file,
          tag.location.line,
          `@example-space pseudo-scenario carries graph-aware tag "${tag.name}"; only @example-space is allowed`,
        ),
      };
    }
  }

  if (scenario.keyword === "Scenario Outline" || scenario.examples.length > 0) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        scenario.location.line,
        `@example-space uses unsupported construct "${scenario.keyword}"; Scenario Outline and Examples are refused`,
      ),
    };
  }
  if (scenario.description.trim().length > 0) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        scenario.location.line + 1,
        "@example-space pseudo-scenario cannot carry a description",
      ),
    };
  }

  return parseSteps(scenario.steps, file, "@example-space pseudo-scenario");
}

function parseRule(rule: Rule, file: string): ParseResult<string> {
  if (rule.tags.length > 0) {
    const tag = rule.tags[0];
    return {
      ok: false,
      finding: grammarFinding(
        file,
        tag?.location.line ?? rule.location.line,
        `Rule "${rule.name}" carries tag "${tag?.name ?? ""}"; Rules are title-only`,
      ),
    };
  }
  if (rule.description.trim().length > 0) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        rule.location.line + 1,
        `Rule "${rule.name}" carries a description; Rules are title-only`,
      ),
    };
  }
  if (rule.children.length > 0) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        rule.location.line,
        `Rule "${rule.name}" has children because Scenarios following a Rule nest under it positionally; place every Scenario before trailing title-only Rules`,
      ),
    };
  }
  return { ok: true, value: rule.name };
}

function reifyOrdinaryScenario(
  scenario: Scenario,
  parentId: string,
  file: string,
): ParseResult<ReifiedSpec> {
  if (scenario.keyword === "Scenario Outline" || scenario.examples.length > 0) {
    return {
      ok: false,
      finding: grammarFinding(
        file,
        scenario.location.line,
        `Scenario construct "${scenario.keyword}" is refused; Scenario Outline and Examples are outside the closed carrier grammar`,
      ),
    };
  }

  const metadata = parseMetadataTags(scenario.tags, file, scenario.location.line, "Scenario");
  if (!metadata.ok) return metadata;
  const description = parseDescription(
    scenario.description,
    file,
    scenario.location.line + 1,
    `Scenario "${scenario.name}"`,
    metadata.value.id,
  );
  if (!description.ok) return description;
  const steps = parseSteps(scenario.steps, file, `Scenario "${scenario.name}"`, metadata.value.id);
  if (!steps.ok) return steps;

  const relations = [...metadata.value.relations];
  if (!relations.some((relation) => relation.type === "refines")) {
    relations.push({ type: "refines", target: parentId, claim: "declared" });
  }
  if (!relations.some((relation) => relation.type === "verifies")) {
    relations.push({ type: "verifies", target: parentId, claim: "declared" });
  }

  return {
    ok: true,
    value: {
      id: metadata.value.id,
      file,
      line: metadata.value.idLine,
      data: {
        id: metadata.value.id,
        kind: "example",
        altitude: metadata.value.altitude,
        readiness: metadata.value.readiness,
        relations,
        title: scenario.name,
        ...description.value,
        behavior: { examples: [steps.value] },
      },
    },
  };
}

function languageHeaderLine(sourceText: string): number {
  const lines = sourceText.split(/\r?\n/u);
  const index = lines.findIndex((line) => LANGUAGE_HEADER.test(line));
  return index === -1 ? 1 : index + 1;
}

function reifyFeature(feature: Feature, sourceText: string, file: string): CarrierReification {
  if (feature.language !== "en") {
    return {
      specs: [],
      packs: [],
      findings: [
        grammarFinding(
          file,
          languageHeaderLine(sourceText),
          `Gherkin language "${feature.language}" is refused; the carrier grammar is closed to en`,
        ),
      ],
    };
  }

  const metadata = parseMetadataTags(feature.tags, file, feature.location.line, "Feature");
  if (!metadata.ok) return { specs: [], packs: [], findings: [metadata.finding] };
  const description = parseDescription(
    feature.description,
    file,
    feature.location.line + 1,
    `Feature "${feature.name}"`,
    metadata.value.id,
  );
  if (!description.ok) return { specs: [], packs: [], findings: [description.finding] };

  const rules: string[] = [];
  const children: ReifiedSpec[] = [];
  let exampleSpace:
    | { readonly given: string[]; readonly when: string[]; readonly then: string[] }
    | undefined;
  let exampleSpaceCount = 0;

  for (const child of feature.children) {
    if (child.background !== undefined) {
      return {
        specs: [],
        packs: [],
        findings: [
          grammarFinding(
            file,
            child.background.location.line,
            `Feature "${feature.name}" carries unsupported construct "Background"`,
            metadata.value.id,
          ),
        ],
      };
    }
    if (child.rule !== undefined) {
      const parsedRule = parseRule(child.rule, file);
      if (!parsedRule.ok) return { specs: [], packs: [], findings: [parsedRule.finding] };
      rules.push(parsedRule.value);
      continue;
    }
    if (child.scenario === undefined) continue;

    if (child.scenario.tags.some((tag) => tag.name === "@example-space")) {
      exampleSpaceCount += 1;
      if (exampleSpaceCount > 1) {
        return {
          specs: [],
          packs: [],
          findings: [
            grammarFinding(
              file,
              child.scenario.location.line,
              `Feature "${feature.name}" carries more than one @example-space pseudo-scenario`,
              metadata.value.id,
            ),
          ],
        };
      }
      const parsedSpace = parseExampleSpaceScenario(child.scenario, file);
      if (!parsedSpace.ok) return { specs: [], packs: [], findings: [parsedSpace.finding] };
      exampleSpace = parsedSpace.value;
      continue;
    }

    const scenario = reifyOrdinaryScenario(child.scenario, metadata.value.id, file);
    if (!scenario.ok) return { specs: [], packs: [], findings: [scenario.finding] };
    children.push(scenario.value);
  }

  const behavior = {
    ...(rules.length === 0 ? {} : { rules }),
    ...(exampleSpace === undefined ? {} : { exampleSpace }),
  };
  const parent: ReifiedSpec = {
    id: metadata.value.id,
    file,
    line: metadata.value.idLine,
    data: {
      id: metadata.value.id,
      kind: "behavior",
      altitude: metadata.value.altitude,
      readiness: metadata.value.readiness,
      relations: metadata.value.relations,
      title: feature.name,
      ...description.value,
      ...(Object.keys(behavior).length === 0 ? {} : { behavior }),
    },
  };

  return { specs: [parent, ...children], packs: [], findings: [] };
}

export function reifyGherkinCarrier(sourceText: string, relativePath: string): CarrierReification {
  try {
    const envelopes = generateMessages(
      sourceText,
      relativePath,
      SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
      {
        newId: IdGenerator.incrementing(),
        includeSource: false,
        includeGherkinDocument: true,
        includePickles: false,
      },
    );
    const parseError = envelopes.find((envelope) => envelope.parseError !== undefined)?.parseError;
    if (parseError !== undefined) {
      return {
        specs: [],
        packs: [],
        findings: [
          finding(
            extractFindingIds.gherkinSyntax,
            `the Gherkin file does not parse: ${parseError.message}; the file is excluded`,
            relativePath,
            parseError.source.location?.line ?? 1,
          ),
        ],
      };
    }

    const document = envelopes.find(
      (envelope) => envelope.gherkinDocument !== undefined,
    )?.gherkinDocument;
    if (document?.feature === undefined) {
      return {
        specs: [],
        packs: [],
        findings: [
          grammarFinding(relativePath, 1, "the Gherkin carrier must contain exactly one Feature"),
        ],
      };
    }

    return reifyFeature(document.feature, sourceText, relativePath);
  } catch (error: unknown) {
    return {
      specs: [],
      packs: [],
      findings: [
        finding(
          extractFindingIds.gherkinSyntax,
          `the Gherkin carrier could not be reified: ${error instanceof Error ? error.message : "an unknown value was thrown"}`,
          relativePath,
          1,
        ),
      ],
    };
  }
}
