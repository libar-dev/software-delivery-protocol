import { renderMemo } from "./memo.js";
import { proposalProblems, scopeRef } from "./proposal.js";
import type { Proposal, ProposalChange } from "./proposal.js";
export interface GatheredIntent {
  scope: string[];
  request: string;
  text?: string;
  replaces?: string;
  follows?: string;
  pack?: string;
  action: string;
}
export interface IntentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export interface Handoff {
  proposal: Proposal | null;
  memo: string | null;
  apart: readonly GatheredIntent[];
  scopedText: string;
}
function validIntent(value: unknown): value is GatheredIntent {
  if (value === null || typeof value !== "object") return false;
  const i = value as Record<string, unknown>;
  return (
    Array.isArray(i.scope) &&
    i.scope.every((s) => typeof s === "string") &&
    typeof i.request === "string" &&
    i.request.trim().length > 0 &&
    typeof i.action === "string" &&
    ["text", "replaces", "follows", "pack"].every(
      (k) => i[k] === undefined || typeof i[k] === "string",
    )
  );
}
export function pageRootPath(root: string, page: string): string {
  return new URL(root || "./", page).pathname;
}
export function scopedIntentText(intents: readonly GatheredIntent[]): string {
  return intents
    .map(
      (i) =>
        `${i.pack ?? i.scope.join(", ")}\n${i.request}${i.text === undefined ? "" : `\nExact text:\n${i.text}`}\n`,
    )
    .join("\n");
}
/**
 * @sdpAnchor impl:protocol.studio-intent-panel
 * @sdpLabel gathers ordered intents under the page-root storage key and partitions their hand-off
 * @sdpSatisfies spec:consumers.spec-studio.intent-panel
 * @sdpReferences spec:consumers.edit-model, spec:consumers.intent-composition
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole service
 */
export class IntentPanel {
  private gathered: GatheredIntent[] = [];
  private pending: ((intents: GatheredIntent[]) => GatheredIntent[])[] = [];
  readonly key: string;
  storageProblem = false;
  constructor(
    private readonly storage: IntentStorage | undefined,
    rootPath: string,
  ) {
    this.key = `sdp-studio:intents:${rootPath}`;
    this.refresh();
  }
  refresh(): void {
    if (!this.storage) {
      this.storageProblem = true;
      return;
    }
    try {
      const value: unknown = JSON.parse(this.storage.getItem(this.key) ?? "[]");
      if (Array.isArray(value)) {
        this.gathered = value.filter(validIntent);
        this.storageProblem = this.gathered.length !== value.length;
        for (const change of this.pending) this.gathered = change(this.gathered);
        if (this.pending.length) this.storageProblem = true;
      } else this.storageProblem = true;
    } catch {
      this.storageProblem = true;
    }
  }
  get intents(): readonly GatheredIntent[] {
    return this.gathered;
  }
  private persist(): void {
    try {
      this.storage?.setItem(this.key, JSON.stringify(this.gathered));
      if (!this.storage) this.storageProblem = true;
      else this.pending = [];
    } catch {
      this.storageProblem = true;
    }
  }
  private change(change: (intents: GatheredIntent[]) => GatheredIntent[]): void {
    this.refresh();
    this.gathered = change(this.gathered);
    this.pending.push(change);
    this.persist();
  }
  gather(intent: GatheredIntent): void {
    if (!validIntent(intent)) throw new Error("Give the intent a scope and a request.");
    const gathered = { ...intent, scope: [...intent.scope] };
    this.change((intents) => [...intents, gathered]);
  }
  discard(index: number): void {
    const target = this.gathered[index];
    this.change((intents) => {
      const current = intents.findIndex(
        (intent) => JSON.stringify(intent) === JSON.stringify(target),
      );
      return intents.filter((_, index) => index !== current);
    });
  }
  discardAll(): void {
    this.change(() => []);
  }
  handoff(base: string, reason: string, stampedCommit?: string): Handoff {
    const changes: ProposalChange[] = [];
    const apart: GatheredIntent[] = [];
    for (const intent of this.gathered) {
      const { scope, request, text, replaces, follows } = intent;
      const change: ProposalChange = {
        scope: [...scope],
        request,
        ...(text === undefined ? {} : { text }),
        ...(replaces === undefined ? {} : { replaces }),
        ...(follows === undefined ? {} : { follows }),
      };
      const candidate: Proposal = { schema: "sdp-proposal/1", base, reason, changes: [change] };
      const packAllowed =
        !intent.pack ||
        (base === stampedCommit &&
          scope.length > 0 &&
          intent.action !== "change-pack" &&
          scope.every(scopeRef));
      if (!base.trim() || !reason.trim() || !packAllowed || proposalProblems(candidate).length)
        apart.push(intent);
      else changes.push(change);
    }
    const proposal: Proposal | null = changes.length
      ? { schema: "sdp-proposal/1", base, reason, changes }
      : null;
    return {
      proposal,
      memo: proposal === null ? null : renderMemo(proposal),
      apart,
      scopedText: scopedIntentText(apart),
    };
  }
}
