import { SPEC_READINESS } from "../../../model/descriptors.js";
import type { PackContext } from "../../../reader/reader.js";
import { code, escape, rungLine } from "./html.js";
import { codeSpans } from "./text.js";
/**
 * @sdpAnchor impl:protocol.studio-maturity-map
 * @sdpLabel places resolved Pack members by their stated rung and floor in authored order
 * @sdpSatisfies spec:consumers.spec-studio.pack-page.maturity-map, spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function maturityMap(pack: PackContext): string {
  const floors = ["none", ...SPEC_READINESS];
  return `<sdp-maturity-map pack-id="${escape(pack.id)}"><h2>Maturity map</h2><div class="table-scroll" role="region" aria-label="Maturity map" tabindex="0"><table><caption>To the right of the matching rung: floor above statement, already allowing it. To its left: statement above floor.</caption><thead><tr><th scope="col">Stated rung / floor reached</th>${floors.map((f) => `<th scope="col">floor ${f}</th>`).join("")}</tr></thead><tbody>${SPEC_READINESS.map(
    (stated) =>
      `<tr><th scope="row">stated ${stated}</th>${floors
        .map((floor) => {
          const rows = pack.members.filter(
            (m) =>
              m.resolved &&
              m.statedReadiness === stated &&
              (m.derivedReadiness ?? "none") === floor,
          );
          const relation =
            floors.indexOf(floor) > floors.indexOf(stated)
              ? "floor above statement"
              : floors.indexOf(floor) < floors.indexOf(stated)
                ? "statement above floor"
                : "statement matches floor";
          return rows.length
            ? `<td><p>${String(rows.length)} · ${relation}</p>${rows.map((m) => `<sdp-spec-card spec-id="${escape(m.id)}" variant="short"><p><a href="#${escape(m.id)}">${codeSpans(m.title ?? m.id)}</a> · ${code(m.id)} · ${rungLine(m.statedReadiness, m.derivedReadiness)}</p></sdp-spec-card>`).join("")}</td>`
            : "<td>—</td>";
        })
        .join("")}</tr>`,
  ).join("")}</tbody></table></div></sdp-maturity-map>`;
}
