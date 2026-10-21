import type { ConceptRecord } from "../reader/concept-match.js";
import { matchConcept } from "../reader/concept-match.js";
import { button, escapeHtml, liveOutput } from "./dom.js";
import { searchFragment, searchTerm } from "./search.js";
import { pagePath } from "../projections/studio/paths.js";
import { codeSpans } from "../projections/studio/pages/code-spans.js";

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

// Serialized non-string values are not authored prose. Walk the original sections once per
// search and identify strings by section, entry path and text, without changing the index shape.
function stringEntries(record: SearchRecord): ReadonlySet<string> {
  const strings = new Set<string>();
  for (const [section, content] of Object.entries(record.sections ?? {})) {
    const walk = (value: unknown, path: string | null): void => {
      if (typeof value === "string") strings.add(JSON.stringify([section, path, value]));
      else if (Array.isArray(value))
        value.forEach((item: unknown, i) => {
          walk(item, `${path ?? ""}[${String(i)}]`);
        });
      else if (typeof value === "object" && value !== null)
        for (const [key, item] of Object.entries(value))
          walk(item, path === null ? key : `${path}.${key}`);
    };
    walk(content, null);
  }
  return strings;
}

function matchesEntry(
  entry: SearchEntry,
  wanted: readonly string[],
  strings: ReadonlySet<string>,
): boolean {
  return (
    (entry.key !== null && hasTokens(entry.key, wanted)) ||
    (entry.section === "model" &&
      entry.address?.includes("#term.") === true &&
      hasTokens(entry.address.split("#term.")[1] ?? "", wanted)) ||
    ((entry.section === "narrative" ||
      strings.has(JSON.stringify([entry.section, entry.entry, entry.text]))) &&
      hasTokens(entry.text, wanted))
  );
}

export function entryMatches(record: SearchRecord, entry: SearchEntry, term: string): boolean {
  return matchesEntry(entry, tokensOf(term), stringEntries(record));
}

/**
 * Keeps concept hits in their existing order and appends key/file-only hits by id.
 *
 * @sdpAnchor impl:protocol.studio-search-results
 * @sdpSatisfies spec:consumers.spec-studio.search, spec:consumers.spec-studio.page-elements
 * @sdpReferences spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole projection
 */
export function searchRecords(index: SearchIndex, term: string): readonly SearchHit[] {
  const needle = term.toLowerCase().trim();
  if (needle.length === 0) return [];
  const wanted = tokensOf(term);
  const concepts = matchConcept(index.records, term);
  const byId = new Map(index.records.map((record) => [record.id, record]));
  const conceptIds = new Set(concepts.map((hit) => hit.id));
  const makeHit = (record: SearchRecord, fields: readonly string[]): SearchHit => {
    const strings = stringEntries(record);
    const entries =
      record.nodeType === "Primitive"
        ? record.entries.filter((entry) => matchesEntry(entry, wanted, strings))
        : [];
    const matchedIn = [...fields];
    if (
      record.entries.some(
        (entry) =>
          entry.key !== null &&
          (entry.key.toLowerCase().includes(needle) || hasTokens(entry.key, wanted)),
      )
    )
      matchedIn.push("key");
    if (record.file?.toLowerCase().includes(needle)) matchedIn.push("file");
    if (matchedIn.length === 0)
      for (const entry of entries) {
        const field = entry.section === "narrative" ? "narrative" : `sections.${entry.section}`;
        if (!matchedIn.includes(field)) matchedIn.push(field);
      }
    return {
      record,
      matchedIn,
      entries,
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
const link = (url: string, label: string, htmlLabel = escapeHtml(label)): string =>
  `<a href="${escapeHtml(url)}">${htmlLabel}</a>`;
const plural = (n: number, singular: string, plural = `${singular}s`): string =>
  `${String(n)} ${n === 1 ? singular : plural}`;
const sectionTitle = (name: string): string =>
  name === "ui" ? "UI" : name.charAt(0).toUpperCase() + name.slice(1);
function fieldLabel(field: string): string {
  if (field.startsWith("sections.")) return `the ${sectionTitle(field.slice(9))} section`;
  return (
    (
      {
        key: "a coined key",
        file: "the file path",
        framing: "Pack framing",
        narrative: "narrative",
        id: "id",
        title: "title",
        label: "label",
      } as Record<string, string>
    )[field] ?? field
  );
}

function sourceMark(file: string | undefined, line: number | undefined): string {
  if (file === undefined || line === undefined) return "";
  const value = `${file}:${String(line)}`;
  return `<code data-source-file="${escapeHtml(file)}" data-source-line="${String(line)}">${escapeHtml(value)}</code> <sdp-copy text="${escapeHtml(value)}"></sdp-copy>`;
}

function excerpt(text: string, term: string): string {
  if (text.length <= 180) return text;
  const at = text.toLowerCase().indexOf(term.toLowerCase().trim());
  const start = at < 60 ? 0 : text.lastIndexOf(" ", at - 60) + 1;
  const boundary = text.indexOf(" ", start + 180);
  const end = boundary < 0 ? text.length : boundary;
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trimEnd()}${end < text.length ? "…" : ""}`;
}

export function renderResults(hits: readonly SearchHit[], term: string, limit: number): string {
  const page = resultPage(hits, limit);
  if (term.trim().length === 0) return `<p>Type a word to search.</p><p>${fieldsSearched}</p>`;
  if (hits.length === 0)
    return `<p>No node matches ${escapeHtml(term)}</p><p>${fieldsSearched}</p>`;
  const header = `<p><code>${escapeHtml(term)}</code>: ${plural(page.total, "node")} and ${plural(page.entryTotal, "entry", "entries")} match. ${fieldsSearched}</p>`;
  return (
    header +
    page.shown
      .map(({ record, matchedIn, entries }) => {
        const heading = record.title ?? record.label ?? record.id;
        const title =
          record.page === null
            ? codeSpans(heading)
            : link(record.page, heading, codeSpans(heading));
        const descriptor =
          record.nodeType === "Primitive"
            ? `<p>Spec · ${escapeHtml(record.specKind ?? "")} · stated ${escapeHtml(record.statedReadiness ?? "unknown")} · floor ${escapeHtml(record.floorReached ?? "none")}</p>`
            : `<p>${nodeWords[record.nodeType]}</p>`;
        const location =
          record.file === undefined
            ? ""
            : `${record.file}${record.line === undefined ? "" : `:${String(record.line)}`}`;
        const unit =
          record.nodeType === "Anchor" || record.nodeType === "CodeNode"
            ? `<p>${record.line === undefined ? `${escapeHtml(location)} <sdp-copy text="${escapeHtml(location || record.id)}"></sdp-copy>` : sourceMark(record.file, record.line)}</p><ul>${record.bindings.map((binding) => `<li>${escapeHtml(binding.edge)} ${link(pagePath(binding.specId) ?? "", binding.specId)}</li>`).join("")}</ul>`
            : "";
        const entryList =
          entries.length === 0
            ? ""
            : `<ul class="search-entries">${entries.map((entry) => `<li>${link(entryUrl(record, entry), entry.key ?? entry.entry ?? entry.section, `<code>${escapeHtml(entry.key ?? entry.entry ?? entry.section)}</code>`)} · ${escapeHtml(sectionTitle(entry.section))} · ${entry.line === null ? "line not recorded" : `line ${String(entry.line)} ${sourceMark(record.file, entry.line)}`} · ${escapeHtml(excerpt(entry.text, term))}</li>`).join("")}</ul>`;
        return `<article class="search-result"><h2>${title}</h2><code>${escapeHtml(record.id)}</code>${descriptor}<p>Matched in: ${escapeHtml(matchedIn.map(fieldLabel).join(", "))}</p>${unit}${entryList}</article>`;
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
    private readonly onInput = (): void => {
      this.setTerm(this.input?.value ?? "", true);
    };

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
      if (this.status) {
        this.status.textContent =
          this.term.trim().length === 0
            ? "Type a word to search."
            : hits.length === 0
              ? `No node matches ${this.term}`
              : `Showing ${String(page.shown.length)} of ${plural(page.total, "node")}`;
        this.status.className = page.total > 50 ? "" : "visually-hidden";
      }
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
      if (!this.results) {
        this.input =
          this.ownerDocument.querySelector<HTMLInputElement>('sdp-search input[name="q"]') ??
          undefined;
        const form = this.input ? undefined : this.ownerDocument.createElement("form");
        if (form) {
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
        }
        this.results = this.ownerDocument.createElement("div");
        this.results.className = "search-results";
        this.more = button(this, "Show next fifty");
        this.more.addEventListener("click", () => {
          this.limit += 50;
          this.render();
        });
        this.replaceChildren(...(form ? [form] : []));
        this.status = liveOutput(this);
        this.append(this.results, this.more);
      }
      this.input?.addEventListener("input", this.onInput);
      this.ownerDocument.defaultView?.addEventListener("hashchange", this.onHash);
      this.onHash();
    }

    disconnectedCallback(): void {
      this.input?.removeEventListener("input", this.onInput);
      this.ownerDocument.defaultView?.removeEventListener("hashchange", this.onHash);
    }
  }
  if (!globalThis.customElements.get("sdp-search-results"))
    globalThis.customElements.define("sdp-search-results", SearchResults);
}
