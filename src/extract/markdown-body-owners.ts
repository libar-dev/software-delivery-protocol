import type { Finding } from "../validate/contracts.js";
import type { MarkdownLine } from "./markdown-body-content.js";
import { mapBehavior, mapExampleSpace, mapIntent } from "./markdown-body-owner-behavior.js";
import {
  mapConstraints,
  mapDecision,
  mapModel,
  mapOpen,
  mapVerification,
} from "./markdown-body-owner-sections.js";
import { isRecord, structureFinding } from "./markdown-body-owner-support.js";
import { addMarkdownFinding } from "./markdown-support.js";

export function mapOwner(
  target: Record<string, unknown>,
  owner: string,
  lines: readonly MarkdownLine[],
  file: string,
  kind: string,
  findings: Finding[],
): void {
  if (owner === "Intent") {
    const intent: Record<string, unknown> = {};
    mapIntent(intent, target, lines, file, kind, findings);
    target.intent = intent;
    return;
  }
  if (["Behavior", "Rule", "Workflow", "Contract"].includes(owner)) {
    const behavior: Record<string, unknown> = isRecord(target.behavior) ? target.behavior : {};
    mapBehavior(behavior, owner, lines, file, findings);
    target.behavior = behavior;
    return;
  }
  if (owner === "Example space") {
    const behavior: Record<string, unknown> = isRecord(target.behavior) ? target.behavior : {};
    mapExampleSpace(behavior, lines, file, findings);
    target.behavior = behavior;
    return;
  }
  if (owner === "Constraints") {
    mapConstraints(target, lines, file, findings);
    return;
  }
  if (owner === "Model") {
    const model: Record<string, unknown> = {};
    mapModel(model, lines, file, findings);
    target.model = model;
    return;
  }
  if (owner === "Design" || owner === "UI") {
    const section: Record<string, unknown> = {};
    mapOpen(section, lines, file, findings);
    target[owner.toLowerCase()] = section;
    return;
  }
  if (owner === "Decision") {
    const decision: Record<string, unknown> = {};
    mapDecision(decision, lines, file, findings);
    target.decision = decision;
    return;
  }
  if (owner.startsWith("Verification — ")) {
    const verification: Record<string, unknown> = {};
    mapVerification(verification, lines, file, findings);
    verification.mode = owner.slice("Verification — ".length);
    target.verification = verification;
    return;
  }
  if (kind === "example")
    addMarkdownFinding(
      findings,
      structureFinding(file, lines[0]?.line ?? 1, "example gwt placement is invalid"),
    );
}
