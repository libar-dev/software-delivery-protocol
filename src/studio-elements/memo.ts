import type { Proposal } from "./proposal.js";
const longestRun = (value: string): number =>
  Math.max(0, ...Array.from(value.matchAll(/`+/gu), (m) => m[0].length));
function span(value: string): string {
  const ticks = "`".repeat(longestRun(value) + 1);
  const pad = value.startsWith("`") || value.endsWith("`") ? " " : "";
  return `${ticks}${pad}${value}${pad}${ticks}`;
}
function fenced(value: string, language = ""): string {
  const ticks = "`".repeat(Math.max(3, longestRun(value) + 1));
  return `${ticks}${language}\n${value}\n${ticks}\n`;
}
/**
 * @sdpAnchor impl:protocol.studio-proposal-memo
 * @sdpLabel renders proposal fields verbatim with fences that outgrow their content
 * @sdpSatisfies spec:consumers.intent-composition.proposal.memo
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole projection
 */
export function renderMemo(proposal: Proposal): string {
  let memo = `# Change proposal\n\nBase: ${span(proposal.base)}\nReason: ${proposal.reason}\n\n`;
  proposal.changes.forEach((change, index) => {
    memo += `## Change ${String(index + 1)}\n\nScope: ${change.scope.map(span).join(", ")}\nRequest:\n\n${fenced(change.request, "text")}`;
    if (change.replaces !== undefined) memo += `Replaces: ${span(change.replaces)}\n`;
    if (change.follows !== undefined) memo += `Follows: ${span(change.follows)}\n`;
    if (change.relation) {
      const r = change.relation;
      memo += `Relation: ${r.action} ${span(r.from)} ${r.type} ${span(r.target)}\n`;
    }
    if (change.reason !== undefined) memo += `Reason: ${change.reason}\n`;
    if (change.text !== undefined) memo += `\n${fenced(change.text)}`;
    memo += "\n";
  });
  return `${memo}## The proposal\n\n${fenced(JSON.stringify(proposal, null, 2), "json")}`;
}
