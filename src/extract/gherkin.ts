import { generateMessages } from "@cucumber/gherkin";
import {
  IdGenerator,
  SourceMediaType,
  StepKeywordType,
  type Comment,
  type Feature,
  type Rule,
  type Scenario,
  type Step,
  type Tag,
} from "@cucumber/messages";

import { codeAnchorId, parseId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
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

const RESERVED_HEAD_SUGGESTIONS = [
  { head: "spec", lawful: true },
  { head: "altitude", lawful: true },
  { head: "readiness", lawful: true },
  { head: "kind", lawful: false },
  { head: "pack", lawful: false },
  { head: "supersedes", lawful: false },
  { head: "verifies", lawful: true },
  { head: "refines", lawful: true },
  { head: "depends-on", lawful: true },
  { head: "constrained-by", lawful: true },
  { head: "decided-by", lawful: true },
  { head: "example-space", lawful: false },
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
const MAX_GHERKIN_FINDINGS = 100;

interface DescriptionSections {
  readonly intent?: Record<string, unknown>;
  readonly verification?: Record<string, unknown>;
  readonly narrative?: string;
}

interface DescriptionOwner {
  readonly description: string;
  readonly location: { readonly line: number };
}

interface LocatedDescriptionLine {
  readonly text: string;
  readonly line: number;
}

interface GherkinSourceIndex {
  readonly descriptions: ReadonlyMap<DescriptionOwner, readonly LocatedDescriptionLine[]>;
  readonly languageHeaderLine: number;
}

interface ParsedMetadata {
  readonly id: string;
  readonly idLine: number;
  readonly altitude: SpecAltitude;
  readonly readiness: SpecReadiness;
  readonly relations: readonly ReifiedRelation[];
}

interface ParsedMetadataResult {
  readonly id?: string;
  readonly value?: ParsedMetadata;
}

type ParseResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly finding: Finding };

interface GherkinFindingCollector {
  readonly findings: Finding[];
  findingCount: number;
}

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

function appendFinding(collector: GherkinFindingCollector, next: Finding, file: string): void {
  collector.findingCount += 1;
  if (collector.findings.length >= MAX_GHERKIN_FINDINGS) return;
  if (collector.findings.length === MAX_GHERKIN_FINDINGS - 1) {
    collector.findings.push(
      finding(
        extractFindingIds.tooManyGherkinFindings,
        `the Gherkin carrier produced too many semantic findings; reporting is capped at ${String(MAX_GHERKIN_FINDINGS)}`,
        file,
        1,
      ),
    );
    return;
  }
  collector.findings.push(next);
}

function addScenarioDescriptionOwners(owners: DescriptionOwner[], scenario: Scenario): void {
  owners.push(scenario, ...scenario.examples);
}

function descriptionOwners(feature: Feature): readonly DescriptionOwner[] {
  const owners: DescriptionOwner[] = [feature];

  for (const child of feature.children) {
    if (child.background !== undefined) owners.push(child.background);
    if (child.scenario !== undefined) addScenarioDescriptionOwners(owners, child.scenario);
    if (child.rule === undefined) continue;

    owners.push(child.rule);
    for (const ruleChild of child.rule.children) {
      if (ruleChild.background !== undefined) owners.push(ruleChild.background);
      if (ruleChild.scenario !== undefined) {
        addScenarioDescriptionOwners(owners, ruleChild.scenario);
      }
    }
  }

  return owners;
}

function buildGherkinSourceIndex(
  sourceText: string,
  comments: readonly Comment[],
  feature: Feature,
  file: string,
): ParseResult<GherkinSourceIndex> {
  const sourceLines = sourceText.split(/\r?\n/u);
  const commentLines = new Set(comments.map((comment) => comment.location.line));
  const descriptions = new Map<DescriptionOwner, readonly LocatedDescriptionLine[]>();

  for (const owner of descriptionOwners(feature)) {
    const located: LocatedDescriptionLine[] = [];
    const descriptionLines = owner.description.length === 0 ? [] : owner.description.split("\n");
    let sourceLine = owner.location.line + 1;

    for (const descriptionLine of descriptionLines) {
      let aligned = false;
      while (sourceLine <= sourceLines.length) {
        const physicalLine = sourceLines.at(sourceLine - 1) ?? "";
        if (commentLines.has(sourceLine)) {
          sourceLine += 1;
          continue;
        }
        if (physicalLine === descriptionLine) {
          located.push({ text: descriptionLine, line: sourceLine });
          sourceLine += 1;
          aligned = true;
          break;
        }
        if (physicalLine.trim().length === 0) {
          sourceLine += 1;
          continue;
        }
        return {
          ok: false,
          finding: finding(
            extractFindingIds.gherkinSyntax,
            `the Gherkin parser description at line ${String(owner.location.line)} does not match physical source line ${String(sourceLine)}; the file is excluded`,
            file,
            sourceLine,
          ),
        };
      }
      if (!aligned) {
        const line = Math.max(1, sourceLines.length);
        return {
          ok: false,
          finding: finding(
            extractFindingIds.gherkinSyntax,
            `the Gherkin parser description at line ${String(owner.location.line)} extends past the physical source; the file is excluded`,
            file,
            line,
          ),
        };
      }
    }

    descriptions.set(owner, located);
  }

  const languageHeaderIndex = sourceLines.findIndex((line) => LANGUAGE_HEADER.test(line));
  return {
    ok: true,
    value: {
      descriptions,
      languageHeaderLine: languageHeaderIndex === -1 ? 1 : languageHeaderIndex + 1,
    },
  };
}

function indexedDescription(
  sourceIndex: GherkinSourceIndex,
  owner: DescriptionOwner,
): readonly LocatedDescriptionLine[] {
  const description = sourceIndex.descriptions.get(owner);
  if (description === undefined)
    throw new Error("Gherkin description owner was not source-indexed");
  return description;
}

function firstProseLine(sourceIndex: GherkinSourceIndex, owner: DescriptionOwner): number {
  return (
    indexedDescription(sourceIndex, owner).find((line) => line.text.trim().length > 0)?.line ??
    owner.location.line
  );
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

function nearest(
  value: string,
  candidates: readonly string[],
  maximumDistance: number | ((candidate: string) => number),
): string | undefined {
  const maxDistanceFor =
    typeof maximumDistance === "function" ? maximumDistance : () => maximumDistance;

  let winner: string | undefined;
  let distance = Number.POSITIVE_INFINITY;
  let unique = false;

  for (const candidate of candidates) {
    const candidateDistance = levenshtein(value, candidate);
    if (candidateDistance > maxDistanceFor(candidate)) continue;
    if (candidateDistance < distance) {
      winner = candidate;
      distance = candidateDistance;
      unique = true;
    } else if (candidateDistance === distance) {
      unique = false;
    }
  }

  return unique ? winner : undefined;
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

  const authoredHead = tagHead(name);
  const reservedHead = nearest(
    authoredHead,
    RESERVED_HEAD_SUGGESTIONS.map(({ head }) => head),
    (candidate) => (candidate.length <= 5 ? 1 : 2),
  );
  if (reservedHead !== undefined) {
    const candidate = RESERVED_HEAD_SUGGESTIONS.find(({ head }) => head === reservedHead);
    return grammarFinding(
      file,
      tag.location.line,
      `Gherkin decoration tag "${name}" uses authored head "${authoredHead}" too close to reserved graph-aware head "${reservedHead}"${candidate?.lawful === true ? `; did you mean "@${reservedHead}."?` : ""}`,
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
  collector: GherkinFindingCollector,
): ParsedMetadataResult {
  const findingCount = collector.findingCount;
  let id: string | undefined;
  let idLine = keywordLine;
  let altitude: SpecAltitude | undefined;
  let readiness: SpecReadiness | undefined;
  let idTags = 0;
  let altitudeTags = 0;
  let readinessTags = 0;
  const relations: ReifiedRelation[] = [];

  for (const tag of tags) {
    const name = tag.name;
    if (name.startsWith("@spec.")) {
      idTags += 1;
      if (idTags > 1) {
        appendFinding(
          collector,
          grammarFinding(
            file,
            tag.location.line,
            `${construct} carries duplicate identity tag "${name}"; exactly one @spec.<dotted-id> is required`,
            id,
          ),
          file,
        );
        continue;
      }
      const parsed = parseSpecIdToken(
        `spec:${name.slice("@spec.".length)}`,
        name,
        file,
        tag.location.line,
      );
      if (parsed.ok) {
        id = parsed.value;
        idLine = tag.location.line;
      } else {
        appendFinding(collector, parsed.finding, file);
      }
      continue;
    }

    if (name.startsWith("@altitude.")) {
      altitudeTags += 1;
      if (altitudeTags > 1) {
        appendFinding(
          collector,
          grammarFinding(
            file,
            tag.location.line,
            `${construct} carries duplicate altitude tag "${name}"; exactly one altitude is required`,
            id,
          ),
          file,
        );
        continue;
      }
      const value = name.slice("@altitude.".length);
      if (ALTITUDES[value] === true) altitude = value as SpecAltitude;
      else {
        appendFinding(
          collector,
          grammarFinding(
            file,
            tag.location.line,
            `${construct} altitude tag "${name}" is outside epic | feature | story`,
            id,
          ),
          file,
        );
      }
      continue;
    }

    if (name.startsWith("@readiness.")) {
      readinessTags += 1;
      if (readinessTags > 1) {
        appendFinding(
          collector,
          grammarFinding(
            file,
            tag.location.line,
            `${construct} carries duplicate readiness tag "${name}"; exactly one readiness is required`,
            id,
          ),
          file,
        );
        continue;
      }
      const value = name.slice("@readiness.".length);
      if (READINESS[value] === true) readiness = value as SpecReadiness;
      else {
        appendFinding(
          collector,
          grammarFinding(
            file,
            tag.location.line,
            `${construct} readiness tag "${name}" is outside idea | scoped | defined | ready`,
            id,
          ),
          file,
        );
      }
      continue;
    }

    let relationMatched = false;
    for (const [head, relationType] of Object.entries(GHERKIN_RELATION_TAGS)) {
      const prefix = `@${head}.`;
      if (!name.startsWith(prefix)) continue;
      relationMatched = true;
      const parsed = parseSpecIdToken(name.slice(prefix.length), name, file, tag.location.line);
      if (parsed.ok)
        relations.push({ type: relationType, target: parsed.value, claim: "declared" });
      else appendFinding(collector, parsed.finding, file);
      break;
    }
    if (relationMatched) continue;

    if (name === "@example-space") {
      appendFinding(
        collector,
        grammarFinding(
          file,
          tag.location.line,
          `${construct} tag "@example-space" is lawful only on the single pseudo-scenario`,
          id,
        ),
        file,
      );
      continue;
    }

    const refusedDecoration = decorationTagFinding(tag, file);
    if (refusedDecoration !== undefined) appendFinding(collector, refusedDecoration, file);
  }

  if (idTags === 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        keywordLine,
        `${construct} is missing @spec.<dotted-id>; exactly one identity tag is required`,
      ),
      file,
    );
  }
  if (altitudeTags === 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        keywordLine,
        `${construct}${id === undefined ? "" : ` "${id}"`} is missing @altitude.epic|feature|story`,
        id,
      ),
      file,
    );
  }
  if (readinessTags === 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        keywordLine,
        `${construct}${id === undefined ? "" : ` "${id}"`} is missing @readiness.idea|scoped|defined|ready`,
        id,
      ),
      file,
    );
  }

  if (
    collector.findingCount !== findingCount ||
    id === undefined ||
    altitude === undefined ||
    readiness === undefined
  ) {
    return { id };
  }
  return { id, value: { id, idLine, altitude, readiness, relations } };
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
  description: readonly LocatedDescriptionLine[],
  file: string,
  construct: string,
  collector: GherkinFindingCollector,
  subjectId?: string,
): DescriptionSections | undefined {
  const findingCount = collector.findingCount;
  const intent: Record<string, unknown> = {};
  const verification: Record<string, unknown> = {};
  const risks: string[] = [];
  const assumptions: string[] = [];
  const criteria: string[] = [];
  const singular = new Set<string>();
  const narrativeLines: string[] = [];

  for (const descriptionLine of description) {
    const line = descriptionLine.text.trim();
    const lineNumber = descriptionLine.line;
    const keyed = KEYED_LINE.exec(line);

    if (keyed !== null) {
      const key = (keyed[1] ?? "").trim();
      const value = keyed[2] ?? "";
      if (!DESCRIPTION_KEYS.includes(key as (typeof DESCRIPTION_KEYS)[number])) {
        const suggestion = nearest(key, DESCRIPTION_KEYS, 2);
        appendFinding(
          collector,
          grammarFinding(
            file,
            lineNumber,
            `${construct} description key "${key}" is outside the closed set ${DESCRIPTION_KEYS.join(" | ")}${suggestion === undefined ? "" : `; did you mean "${suggestion}"?`}`,
            subjectId,
          ),
          file,
        );
        continue;
      }
      if (value.length === 0) {
        appendFinding(
          collector,
          grammarFinding(
            file,
            lineNumber,
            `${construct} description key "${key}" requires a value`,
            subjectId,
          ),
          file,
        );
        continue;
      }
      if (SINGULAR_INTENT_KEYS[key] === true) {
        if (singular.has(key)) {
          appendFinding(
            collector,
            grammarFinding(
              file,
              lineNumber,
              `${construct} description key "${key}" is authored more than once`,
              subjectId,
            ),
            file,
          );
          continue;
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
          appendFinding(
            collector,
            grammarFinding(
              file,
              lineNumber,
              `${construct} verification mode "${value}" is outside manual | reviewed | contract | executable`,
              subjectId,
            ),
            file,
          );
          continue;
        }
        if (verification.mode !== undefined) {
          appendFinding(
            collector,
            grammarFinding(
              file,
              lineNumber,
              `${construct} description key "verification-mode" is authored more than once`,
              subjectId,
            ),
            file,
          );
          continue;
        }
        verification.mode = value;
      }
      continue;
    }

    if (HEADING_SHAPED_LINE.test(line)) {
      appendFinding(
        collector,
        grammarFinding(
          file,
          lineNumber,
          `${construct} description line "${line}" is heading-shaped; the Gherkin carrier has no description headings`,
          subjectId,
        ),
        file,
      );
      continue;
    }
    narrativeLines.push(line);
  }

  if (risks.length > 0) intent.risks = risks;
  if (assumptions.length > 0) intent.assumptions = assumptions;
  if (criteria.length > 0) verification.criteria = criteria;

  const narrative = normalizeNarrative(narrativeLines);
  if (collector.findingCount !== findingCount) return undefined;
  return {
    ...(Object.keys(intent).length === 0 ? {} : { intent }),
    ...(Object.keys(verification).length === 0 ? {} : { verification }),
    ...(narrative === undefined ? {} : { narrative }),
  };
}

function parseSteps(
  steps: readonly Step[],
  file: string,
  construct: string,
  collector: GherkinFindingCollector,
  subjectId?: string,
): { readonly given: string[]; readonly when: string[]; readonly then: string[] } | undefined {
  const findingCount = collector.findingCount;
  const parsed = { given: [] as string[], when: [] as string[], then: [] as string[] };
  let previous: "given" | "when" | "then" | undefined;

  for (const step of steps) {
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
          appendFinding(
            collector,
            grammarFinding(
              file,
              step.location.line,
              `${construct} starts with conjunction step "${step.keyword.trim()} ${step.text}"; And/But must inherit a preceding phase`,
              subjectId,
            ),
            file,
          );
        } else phase = previous;
        break;
      default:
        appendFinding(
          collector,
          grammarFinding(
            file,
            step.location.line,
            `${construct} step keyword "${step.keyword.trim()}" is refused; '*' and unknown step phases have no carrier meaning`,
            subjectId,
          ),
          file,
        );
    }

    if (step.docString !== undefined) {
      appendFinding(
        collector,
        grammarFinding(
          file,
          step.docString.location.line,
          `${construct} step "${step.text}" carries a doc string, which the closed carrier grammar refuses`,
          subjectId,
        ),
        file,
      );
    }
    if (step.dataTable !== undefined) {
      appendFinding(
        collector,
        grammarFinding(
          file,
          step.dataTable.location.line,
          `${construct} step "${step.text}" carries a data table, which the closed carrier grammar refuses`,
          subjectId,
        ),
        file,
      );
    }

    if (phase !== undefined) {
      parsed[phase].push(step.text);
      previous = phase;
    }
  }

  return collector.findingCount === findingCount ? parsed : undefined;
}

function parseExampleSpaceScenario(
  scenario: Scenario,
  file: string,
  sourceIndex: GherkinSourceIndex,
  collector: GherkinFindingCollector,
): { readonly given: string[]; readonly when: string[]; readonly then: string[] } | undefined {
  const findingCount = collector.findingCount;
  let markerCount = 0;
  for (const tag of scenario.tags) {
    if (tag.name === "@example-space") {
      markerCount += 1;
      if (markerCount > 1) {
        appendFinding(
          collector,
          grammarFinding(
            file,
            tag.location.line,
            `@example-space pseudo-scenario carries ${String(markerCount)} marker tags; exactly one is required`,
          ),
          file,
        );
      }
      continue;
    }

    const refused = decorationTagFinding(tag, file);
    if (refused !== undefined) {
      appendFinding(collector, refused, file);
      continue;
    }
    const head = tagHead(tag.name);
    if (
      RESERVED_TAG_HEADS.includes(head as (typeof RESERVED_TAG_HEADS)[number]) ||
      authoredFactReason(tag.name) !== undefined
    ) {
      appendFinding(
        collector,
        grammarFinding(
          file,
          tag.location.line,
          `@example-space pseudo-scenario carries graph-aware tag "${tag.name}"; only @example-space is allowed`,
        ),
        file,
      );
    }
  }

  if (scenario.keyword === "Scenario Outline" || scenario.examples.length > 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        scenario.location.line,
        `@example-space uses unsupported construct "${scenario.keyword}"; Scenario Outline and Examples are refused`,
      ),
      file,
    );
  }
  if (scenario.steps.length === 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        scenario.location.line,
        "@example-space pseudo-scenario must carry at least one step",
      ),
      file,
    );
  }
  if (scenario.description.trim().length > 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        firstProseLine(sourceIndex, scenario),
        "@example-space pseudo-scenario cannot carry a description",
      ),
      file,
    );
  }

  const steps = parseSteps(scenario.steps, file, "@example-space pseudo-scenario", collector);
  return collector.findingCount === findingCount ? steps : undefined;
}

function parseRule(
  rule: Rule,
  file: string,
  sourceIndex: GherkinSourceIndex,
  collector: GherkinFindingCollector,
): string | undefined {
  const findingCount = collector.findingCount;
  for (const tag of rule.tags) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        tag.location.line,
        `Rule "${rule.name}" carries tag "${tag.name}"; Rules are title-only`,
      ),
      file,
    );
  }
  if (rule.children.length > 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        rule.location.line,
        `Rule "${rule.name}" has children because Scenarios following a Rule nest under it positionally; place every Scenario before trailing title-only Rules`,
      ),
      file,
    );
  }
  if (rule.description.trim().length > 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        firstProseLine(sourceIndex, rule),
        `Rule "${rule.name}" carries a description; Rules are title-only`,
      ),
      file,
    );
  }
  return collector.findingCount === findingCount ? rule.name : undefined;
}

function reifyOrdinaryScenario(
  scenario: Scenario,
  parentId: string | undefined,
  file: string,
  sourceIndex: GherkinSourceIndex,
  collector: GherkinFindingCollector,
): ReifiedSpec | undefined {
  const findingCount = collector.findingCount;
  const metadata = parseMetadataTags(
    scenario.tags,
    file,
    scenario.location.line,
    "Scenario",
    collector,
  );

  if (scenario.keyword === "Scenario Outline" || scenario.examples.length > 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        scenario.location.line,
        `Scenario construct "${scenario.keyword}" is refused; Scenario Outline and Examples are outside the closed carrier grammar`,
        metadata.id,
      ),
      file,
    );
  }
  if (scenario.steps.length === 0) {
    appendFinding(
      collector,
      grammarFinding(
        file,
        scenario.location.line,
        `Scenario "${scenario.name}" must carry at least one step`,
        metadata.id,
      ),
      file,
    );
  }

  const description = parseDescription(
    indexedDescription(sourceIndex, scenario),
    file,
    `Scenario "${scenario.name}"`,
    collector,
    metadata.id,
  );
  const steps = parseSteps(
    scenario.steps,
    file,
    `Scenario "${scenario.name}"`,
    collector,
    metadata.id,
  );

  if (
    collector.findingCount !== findingCount ||
    metadata.value === undefined ||
    description === undefined ||
    steps === undefined ||
    parentId === undefined
  ) {
    return undefined;
  }

  const relations = [...metadata.value.relations];
  if (!relations.some((relation) => relation.type === "refines")) {
    relations.push({ type: "refines", target: parentId, claim: "declared" });
  }
  if (!relations.some((relation) => relation.type === "verifies")) {
    relations.push({ type: "verifies", target: parentId, claim: "declared" });
  }

  return {
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
      ...description,
      behavior: { examples: [steps] },
    },
  };
}

function reifyFeature(
  feature: Feature,
  file: string,
  sourceIndex: GherkinSourceIndex,
): CarrierReification {
  if (feature.language !== "en") {
    return {
      specs: [],
      packs: [],
      findings: [
        grammarFinding(
          file,
          sourceIndex.languageHeaderLine,
          `Gherkin language "${feature.language}" is refused; the carrier grammar is closed to en`,
        ),
      ],
    };
  }

  const collector: GherkinFindingCollector = { findings: [], findingCount: 0 };
  const metadata = parseMetadataTags(
    feature.tags,
    file,
    feature.location.line,
    "Feature",
    collector,
  );
  const description = parseDescription(
    indexedDescription(sourceIndex, feature),
    file,
    `Feature "${feature.name}"`,
    collector,
    metadata.id,
  );

  const rules: string[] = [];
  const children: ReifiedSpec[] = [];
  let exampleSpace:
    | { readonly given: string[]; readonly when: string[]; readonly then: string[] }
    | undefined;
  let exampleSpaceCount = 0;

  for (const child of feature.children) {
    if (child.background !== undefined) {
      appendFinding(
        collector,
        grammarFinding(
          file,
          child.background.location.line,
          `Feature "${feature.name}" carries unsupported construct "Background"`,
          metadata.id,
        ),
        file,
      );
    }
    if (child.rule !== undefined) {
      const parsedRule = parseRule(child.rule, file, sourceIndex, collector);
      if (parsedRule !== undefined) rules.push(parsedRule);
      continue;
    }
    if (child.scenario === undefined) continue;

    if (child.scenario.tags.some((tag) => tag.name === "@example-space")) {
      exampleSpaceCount += 1;
      if (exampleSpaceCount > 1) {
        appendFinding(
          collector,
          grammarFinding(
            file,
            child.scenario.location.line,
            `Feature "${feature.name}" carries more than one @example-space pseudo-scenario`,
            metadata.id,
          ),
          file,
        );
      }
      const parsedSpace = parseExampleSpaceScenario(child.scenario, file, sourceIndex, collector);
      if (parsedSpace !== undefined && exampleSpace === undefined) exampleSpace = parsedSpace;
      continue;
    }

    const scenario = reifyOrdinaryScenario(
      child.scenario,
      metadata.id,
      file,
      sourceIndex,
      collector,
    );
    if (scenario !== undefined) children.push(scenario);
  }

  if (collector.findings.length > 0 || metadata.value === undefined || description === undefined) {
    return { specs: [], packs: [], findings: collector.findings };
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
      ...description,
      ...(Object.keys(behavior).length === 0 ? {} : { behavior }),
    },
  };

  return { specs: [parent, ...children], packs: [], findings: [] };
}

export const gherkinAuthoringAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.gherkin-authoring"),
  label: "reifies Gherkin behavior and example authoring into the one carrier path",
  satisfies: ref("spec:carrier.gherkin-authoring"),
});

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

    const sourceIndex = buildGherkinSourceIndex(
      sourceText,
      document.comments,
      document.feature,
      relativePath,
    );
    if (!sourceIndex.ok) return { specs: [], packs: [], findings: [sourceIndex.finding] };

    return reifyFeature(document.feature, relativePath, sourceIndex.value);
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
