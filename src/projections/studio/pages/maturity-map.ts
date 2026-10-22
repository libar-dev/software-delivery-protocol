import { SPEC_READINESS } from "../../../model/descriptors.js";
import type { PackContext } from "../../../reader/reader.js";
import { code, count, escape, rungLine } from "./html.js";
import { codeSpans } from "./text.js";
import { plainTitle } from "./code-spans.js";
import { mermaidText } from "../diagrams/mermaid.js";
/**
 * @sdpAnchor impl:protocol.studio-maturity-map
 * @sdpLabel places resolved Pack members by their stated rung and floor in authored order
 * @sdpSatisfies spec:consumers.spec-studio.pack-page.maturity-map, spec:consumers.spec-studio.components, spec:consumers.spec-studio.diagram-kinds.maturity-picture
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function maturityMap(pack: PackContext): string {
  const floors = ["none", ...SPEC_READINESS];
  const prefix = `diagram.${pack.id}.maturity`;
  const cells = SPEC_READINESS.flatMap((stated, row) =>
    floors.map((floor, column) => ({
      stated,
      floor,
      row,
      column,
      id: `${prefix}.cell.${stated}.${floor}`,
      members: pack.members.filter(
        (m) =>
          m.resolved && m.statedReadiness === stated && (m.derivedReadiness ?? "none") === floor,
      ),
    })),
  );
  const populated = cells.filter((c) => c.members.length);
  const first = populated[0];
  const uniform = populated.length === 1 && first !== undefined;
  const sentence = uniform
    ? `<p>${String(first.members.length)} members at stated ${first.stated} and floor ${first.floor}: <a href="#${escape(first.id)}">full member list</a>.</p>`
    : "";
  const caption =
    "Rows: stated readiness, idea to ready. Columns: floor reached, none to ready. Each mark counts one member; above 100 members a cell is solid. Floor none is distinct from idea.";
  const legend =
    '<p class="maturity-legend">Outlined diagonal: matches. Right of diagonal: floor above statement. Left of diagonal: statement above floor.</p>';
  const axis = `<text x="152" y="20">Floor reached →</text><text x="8" y="48">Stated readiness ↓</text>${floors.map((floor, i) => `<text x="${String(224 + i * 144)}" y="48" text-anchor="middle">${floor}</text>`).join("")}${SPEC_READINESS.map((stated, i) => `<text x="8" y="${String(88 + i * 120)}">${stated}</text>`).join("")}`;
  const grid = `<figure><figcaption>${caption}</figcaption>${legend}<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-describedby="${escape(prefix)}.text" viewBox="0 0 872 552" width="872" height="552"><title>Maturity map for ${escape(plainTitle(pack.title ?? pack.id))}</title>${axis}${cells
    .map((c) => {
      const x = 152 + c.column * 144,
        y = 64 + c.row * 120,
        n = c.members.length;
      const contents = `<g class="maturity-cell ${n ? `populated${n > 100 ? " solid" : ""}` : "empty"}${c.stated === c.floor ? " matches" : ""}" data-stated="${c.stated}" data-floor="${c.floor}"><rect x="${String(x)}" y="${String(y)}" width="136" height="112"/>${n ? `<text class="cell-count" x="${String(x + 12)}" y="${String(y + 22)}">${String(n)}</text>${n <= 100 ? Array.from({ length: n }, (_, i) => `<circle class="member-mark" cx="${String(x + 14 + (i % 10) * 11)}" cy="${String(y + 34 + Math.floor(i / 10) * 7)}" r="2"/>`).join("") : ""}` : ""}</g>`;
      return n
        ? `<a href="#${escape(c.id)}"><title>stated ${c.stated}, floor ${c.floor}: ${String(n)} members</title>${contents}</a>`
        : contents;
    })
    .join("")}</svg></figure>`;
  const table = `<div class="table-scroll" role="region" aria-label="Maturity counts" tabindex="0"><table><caption>Counts by stated readiness and floor reached. To the right the floor exceeds the statement; to the left the statement exceeds the floor.</caption><thead><tr><th scope="col">Stated rung / floor reached</th>${floors.map((f) => `<th scope="col">floor ${f}</th>`).join("")}</tr></thead><tbody>${SPEC_READINESS.map(
    (stated) =>
      `<tr><th scope="row">stated ${stated}</th>${cells
        .filter((c) => c.stated === stated)
        .map(
          (c) =>
            `<td>${c.members.length ? `<a href="#${escape(c.id)}">${String(c.members.length)}</a>` : "—"}</td>`,
        )
        .join("")}</tr>`,
  ).join("")}</tbody></table></div>`;
  const lists = populated
    .map(
      (c) =>
        `<details id="${escape(c.id)}"><summary>stated ${c.stated}, floor ${c.floor} · ${count(c.members.length, "member", "members", false)}</summary><ul>${c.members.map((m) => `<li><a href="#${escape(m.id)}">${codeSpans(m.title ?? m.id)}</a> · ${code(m.id)} · ${rungLine(m.statedReadiness, m.derivedReadiness)}</li>`).join("")}</ul></details>`,
    )
    .join("");
  const unresolved = pack.members.filter((m) => !m.resolved);
  const sourceId = `${prefix}.source-text`;
  const source = [
    "block-beta",
    "  columns 6",
    '  axis["Stated / floor"]',
    ...floors.map((f, i) => `  h${String(i)}["${f}"]`),
    ...SPEC_READINESS.flatMap((s, row) => [
      `  r${String(row)}["${s}"]`,
      ...cells
        .filter((c) => c.stated === s)
        .flatMap((c) => [
          `  c${String(c.row)}${String(c.column)}["${String(c.members.length)}"]`,
          ...c.members.map(
            (m) =>
              `  %% ${mermaidText(c.id)}: ${mermaidText(m.id)} · ${mermaidText(plainTitle(m.title ?? m.id))}`,
          ),
        ]),
    ]),
    `  %% Accessible count table: ${prefix}.text`,
  ].join("\n");
  return `<sdp-maturity-map pack-id="${escape(pack.id)}"><h2>Maturity map</h2>${sentence}${uniform ? `<details class="maturity-grid"><summary>Stated readiness by floor reached</summary>${grid}</details>` : grid}<details id="${escape(prefix)}.text"><summary>Maturity map as text</summary>${table}</details>${lists}${unresolved.length ? `<section><h3>Unresolved members</h3><ul>${unresolved.map((m) => `<li><a href="#${escape(m.id)}">${code(m.id)}</a></li>`).join("")}</ul></section>` : ""}<details id="${escape(prefix)}.source"><summary>Mermaid source</summary><p>Preferred syntax: block. Fixed categorical cells; membership appears in comments.</p><label for="${escape(sourceId)}">Mermaid source for maturity map</label><textarea readonly id="${escape(sourceId)}" rows="8">${escape(source)}</textarea><sdp-copy for="${escape(sourceId)}"></sdp-copy></details></sdp-maturity-map>`;
}
