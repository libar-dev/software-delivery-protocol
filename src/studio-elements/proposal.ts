export interface ProposalChange {
  scope: string[];
  request: string;
  text?: string;
  replaces?: string;
  follows?: string;
  relation?: { action: "declare" | "remove"; from: string; type: string; target: string };
  reason?: string;
}
export interface Proposal {
  schema: "sdp-proposal/1";
  base: string;
  reason: string;
  changes: ProposalChange[];
}
export interface SchemaProblem {
  path: string;
  problem: string;
}
const specId = /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*(?![\s\S])/u;
const entryAddress =
  /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*#(design|ui|question|rule|term)\.([a-z][A-Za-z0-9]*)(?![\s\S])/u;
export const scopeRef = (value: unknown): value is string =>
  typeof value === "string" && (specId.test(value) || entryAddress.test(value));
export function proposalProblems(proposal: unknown): SchemaProblem[] {
  const problems: SchemaProblem[] = [];
  const problem = (path: string, message: string): void => {
    problems.push({ path, problem: message });
  };
  const closed = (
    value: unknown,
    path: string,
    allowed: string[],
    required: string[],
  ): value is Record<string, unknown> => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      problem(path, "Expected an object.");
      return false;
    }
    for (const key of Object.keys(value))
      if (!allowed.includes(key)) problem(`${path}.${key}`, "Unknown field.");
    for (const key of required)
      if (!Object.hasOwn(value, key)) problem(`${path}.${key}`, "Required field.");
    return true;
  };
  const text = (value: unknown, path: string, nonempty = false): void => {
    if (typeof value !== "string" || (nonempty && value.length === 0))
      problem(path, nonempty ? "Expected a non-empty string." : "Expected a string.");
  };
  const reason = (value: unknown, path: string): void => {
    text(value, path, true);
    if (typeof value === "string" && /[\r\n\u0085\u2028\u2029]/u.test(value))
      problem(path, "Expected one line.");
  };
  const authoredTypes = [
    "refines",
    "dependsOn",
    "constrainedBy",
    "decidedBy",
    "verifies",
    "supersedes",
  ];
  if (
    closed(
      proposal,
      "$",
      ["schema", "base", "reason", "changes"],
      ["schema", "base", "reason", "changes"],
    )
  ) {
    if (proposal.schema !== "sdp-proposal/1") problem("$.schema", "Expected sdp-proposal/1.");
    text(proposal.base, "$.base", true);
    reason(proposal.reason, "$.reason");
    if (!Array.isArray(proposal.changes) || !proposal.changes.length)
      problem("$.changes", "Expected a non-empty list.");
    else
      proposal.changes.forEach((change: unknown, index: number) => {
        const path = `$.changes[${String(index)}]`;
        if (
          !closed(
            change,
            path,
            ["scope", "request", "text", "replaces", "follows", "relation", "reason"],
            ["scope", "request"],
          )
        )
          return;
        if (!Array.isArray(change.scope) || !change.scope.length)
          problem(`${path}.scope`, "Expected a non-empty list.");
        else
          change.scope.forEach((ref: unknown, index: number) => {
            if (!scopeRef(ref))
              problem(`${path}.scope[${String(index)}]`, "Expected a Spec id or entry address.");
          });
        text(change.request, `${path}.request`, true);
        if (Object.hasOwn(change, "text")) text(change.text, `${path}.text`);
        if (Object.hasOwn(change, "reason")) reason(change.reason, `${path}.reason`);
        for (const key of ["replaces", "follows"])
          if (
            Object.hasOwn(change, key) &&
            (typeof change[key] !== "string" || !entryAddress.test(change[key]))
          )
            problem(`${path}.${key}`, "Expected an entry address.");
        if (Object.hasOwn(change, "replaces") && Object.hasOwn(change, "follows"))
          problem(path, "replaces and follows are exclusive.");
        if (
          Object.hasOwn(change, "relation") &&
          closed(
            change.relation,
            `${path}.relation`,
            ["action", "from", "type", "target"],
            ["action", "from", "type", "target"],
          )
        ) {
          const relation = change.relation;
          if (relation.action !== "declare" && relation.action !== "remove")
            problem(`${path}.relation.action`, "Expected declare or remove.");
          if (typeof relation.type !== "string" || !authoredTypes.includes(relation.type))
            problem(`${path}.relation.type`, "Expected an authored relation type.");
          for (const key of ["from", "target"])
            if (typeof relation[key] !== "string" || !specId.test(relation[key]))
              problem(`${path}.relation.${key}`, "Expected a Spec id.");
        }
      });
  }
  return problems;
}
