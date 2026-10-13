import type { ConceptRecord } from "../reader/concept-match.js";
import { matchConcept } from "../reader/concept-match.js";
import { button, escapeHtml, liveOutput } from "./dom.js";
import { searchFragment, searchTerm } from "./search.js";

export interface SearchEntry {
  readonly section: string;
  readonly entry: string | null;
  readonly key: string | null;
  readonly address: string | null;
  readonly line: number | null;
  readonly text: string;
}

export interface SearchRecord extends ConceptRecord {
  readonly page: string | null;
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
export interface SearchHit {
  readonly record: SearchRecord;
  readonly matchedIn: readonly string[];
  readonly entries: readonly SearchEntry[];
}

const tokensOf = (text: string): readonly string[] =>
  text
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 0);

function hasTokens(text: string, wanted: readonly string[]): boolean {
  const tokens = tokensOf(text);
  return (
    wanted.length > 0 &&
    tokens.some((_token, start) =>
      wanted.every((token, offset) => tokens[start + offset] === token),
    )
  );
}

// The index carries JSON text for non-string coined values. Read their original type from the
// same record, rather than treating serialized text as authored prose.
function isStringEntry(record: SearchRecord, entry: SearchEntry): boolean {
  if (entry.section === "narrative") return true;
  const walk = (value: unknown, path: string | null): boolean => {
    if (typeof value === "string") return path === entry.entry && value === entry.text;
    if (Array.isArray(value))
      return value.some((item: unknown, i) => walk(item, `${path ?? ""}[${String(i)}]`));
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).some(([key, item]: [string, unknown]) =>
        walk(item, path === null ? key : `${path}.${key}`),
      );
    }
    return false;
  };
  return walk((record.sections as Record<string, unknown> | undefined)?.[entry.section], null);
}

export function entryMatches(record: SearchRecord, entry: SearchEntry, term: string): boolean {
  const wanted = tokensOf(term);
  return (
    (entry.key !== null && hasTokens(entry.key, wanted)) ||
    (isStringEntry(record, entry) && hasTokens(entry.text, wanted))
  );
}

/**
 * Keeps concept hits in their existing order and appends key/file-only hits by id.
 *
 * @sdpAnchor impl:studio.search-results
 * @sdpSatisfies spec:consumers.spec-studio.search, spec:consumers.spec-studio.page-elements
 * @sdpReferences spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole projection
 */
export function searchRecords(index: SearchIndex, term: string): readonly SearchHit[] {
  const needle = term.toLowerCase().trim();
  if (needle.length === 0) return [];
  const concepts = matchConcept(index.records, term);
  const byId = new Map(index.records.map((record) => [record.id, record]));
  const conceptIds = new Set(concepts.map((hit) => hit.id));
  const makeHit = (record: SearchRecord, fields: readonly string[]): SearchHit => {
    const matchedIn = [...fields];
    if (record.entries.some((entry) => entry.key?.toLowerCase().includes(needle)))
      matchedIn.push("key");
    if (record.file?.toLowerCase().includes(needle)) matchedIn.push("file");
    return {
      record,
      matchedIn,
      entries:
        record.nodeType === "Primitive"
          ? record.entries.filter((entry) => entryMatches(record, entry, term))
          : [],
    };
  };
  const base = concepts.flatMap((hit) => {
    const record = byId.get(hit.id);
    return record === undefined ? [] : [makeHit(record, hit.matchedIn)];
  });
  const added = index.records
    .filter((record) => !conceptIds.has(record.id))
    .map((record) => makeHit(record, []))
    .filter((hit) => hit.matchedIn.length > 0)
    .sort((a, b) => (a.record.id < b.record.id ? -1 : a.record.id > b.record.id ? 1 : 0));
  return [...base, ...added];
}

export function entryUrl(record: SearchRecord, entry: SearchEntry): string {
  const fragment =
    entry.address?.split("#")[1] ??
    (entry.section === "narrative" ? "narrative" : `section.${entry.section}`);
  return `${record.page ?? ""}#${fragment}`;
}

export function resultPage(
  hits: readonly SearchHit[],
  limit: number,
): { shown: readonly SearchHit[]; total: number; entryTotal: number; remaining: number } {
  const shown = hits.slice(0, limit);
  return {
    shown,
    total: hits.length,
    entryTotal: hits.reduce((count, hit) => count + hit.entries.length, 0),
    remaining: hits.length - shown.length,
  };
}

const fieldsSearched =
  "Fields searched: ids, titles, labels, Pack framing, Spec narrative and sections, coined keys, recorded file paths.";
const nodeWords = { Primitive: "Spec", Pack: "Pack", Anchor: "Anchor", CodeNode: "Code unit" };
const specPage = (id: string): string =>
  `specs/${id.slice(5).replace(/[A-Z]/gu, (letter) => `_${letter.toLowerCase()}`)}.html`;
const link = (url: string, label: string): string =>
  `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;

function excerpt(text: string, term: string): string {
  if (text.length <= 180) return text;
  const at = text.toLowerCase().indexOf(term.toLowerCase().trim());
  const start = Math.max(0, at - 60);
  return `${start > 0 ? "…" : ""}${text.slice(start, start + 180)}${start + 180 < text.length ? "…" : ""}`;
}

export function renderResults(hits: readonly SearchHit[], term: string, limit: number): string {
  const page = resultPage(hits, limit);
  const header = `<p>${escapeHtml(term)} · ${String(page.total)} nodes and ${String(page.entryTotal)} entries match.</p><p>${fieldsSearched}</p>`;
  if (hits.length === 0) return `${header}<p>No node matches ${escapeHtml(term)}</p>`;
  return (
    header +
    page.shown
      .map(({ record, matchedIn, entries }) => {
        const heading = record.title ?? record.label ?? record.id;
        const title = record.page === null ? escapeHtml(heading) : link(record.page, heading);
        const descriptor =
          record.nodeType === "Primitive"
            ? `<p>${escapeHtml(record.specKind ?? "")} · stated ${escapeHtml(record.statedReadiness ?? "unknown")} · floor ${escapeHtml(record.floorReached ?? "none")}</p>`
            : "";
        const location =
          record.file === undefined
            ? ""
            : `${record.file}${record.line === undefined ? "" : `:${String(record.line)}`}`;
        const unit =
          record.nodeType === "Anchor" || record.nodeType === "CodeNode"
            ? `<p>${escapeHtml(location)} <sdp-copy text="${escapeHtml(location || record.id)}"></sdp-copy></p><ul>${record.bindings.map((binding) => `<li>${escapeHtml(binding.edge)} ${link(specPage(binding.specId), binding.specId)}</li>`).join("")}</ul>`
            : "";
        const entryList =
          entries.length === 0
            ? ""
            : `<ul class="search-entries">${entries.map((entry) => `<li>${link(entryUrl(record, entry), entry.section)} <code>${escapeHtml(entry.key ?? entry.entry ?? "")}</code> · ${entry.line === null ? "line not recorded" : `line ${String(entry.line)}`} · ${escapeHtml(excerpt(entry.text, term))}</li>`).join("")}</ul>`;
        return `<article class="search-result"><p>${nodeWords[record.nodeType]}</p><h2>${title}</h2><code>${escapeHtml(record.id)}</code>${descriptor}<p>Matched ${escapeHtml(matchedIn.join(", "))}</p>${unit}${entryList}</article>`;
      })
      .join("")
  );
}

export function registerSearchResults(): void {
  class SearchResults extends globalThis.HTMLElement {
    private index: SearchIndex = { records: [] };
    private term = "";
    private limit = 50;
    private input?: HTMLInputElement;
    private results?: HTMLDivElement;
    private more?: HTMLButtonElement;
    private status?: HTMLOutputElement;

    private readonly onHash = (): void => {
      this.setTerm(searchTerm(this.ownerDocument.location.hash), false);
    };

    private setTerm(term: string, updateFragment: boolean): void {
      this.term = term;
      this.limit = 50;
      if (this.input) this.input.value = term;
      if (updateFragment)
        this.ownerDocument.defaultView?.history.replaceState(null, "", searchFragment(term));
      this.render();
    }

    private render(): void {
      const hits = searchRecords(this.index, this.term);
      const page = resultPage(hits, this.limit);
      if (this.results) this.results.innerHTML = renderResults(hits, this.term, this.limit);
      if (this.more) this.more.hidden = page.remaining === 0;
      if (this.status)
        this.status.textContent = `${String(page.shown.length)} of ${String(page.total)} nodes shown · ${String(page.entryTotal)} entries match`;
    }

    connectedCallback(): void {
      try {
        const data = JSON.parse(
          this.ownerDocument.getElementById("sdp-data")?.textContent ?? "{}",
        ) as Partial<SearchIndex>;
        this.index = Array.isArray(data.records) ? (data as SearchIndex) : { records: [] };
      } catch {
        this.index = { records: [] };
      }
      if (!this.input) {
        const form = this.ownerDocument.createElement("form");
        const label = this.ownerDocument.createElement("label");
        label.textContent = "Search the corpus ";
        this.input = this.ownerDocument.createElement("input");
        this.input.type = "search";
        this.input.name = "q";
        label.append(this.input);
        const submit = button(this, "Search");
        submit.type = "submit";
        form.append(label, submit);
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          this.setTerm(this.input?.value ?? "", true);
        });
        this.input.addEventListener("input", () => {
          this.setTerm(this.input?.value ?? "", true);
        });
        this.results = this.ownerDocument.createElement("div");
        this.results.className = "search-results";
        this.more = button(this, "Show next fifty");
        this.more.addEventListener("click", () => {
          this.limit += 50;
          this.render();
        });
        this.replaceChildren(form);
        this.status = liveOutput(this);
        this.append(this.results, this.more);
      }
      this.ownerDocument.defaultView?.addEventListener("hashchange", this.onHash);
      this.onHash();
    }

    disconnectedCallback(): void {
      this.ownerDocument.defaultView?.removeEventListener("hashchange", this.onHash);
    }
  }
  if (!globalThis.customElements.get("sdp-search-results"))
    globalThis.customElements.define("sdp-search-results", SearchResults);
}
