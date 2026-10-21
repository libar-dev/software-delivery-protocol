import { frame } from "./frame.js";
import type { PageContext } from "./html.js";
/**
 * @sdpAnchor impl:protocol.studio-evidence-lens
 * @sdpLabel names the four evidence sources and what would bring each into the Studio
 * @sdpSatisfies spec:consumers.spec-studio.lenses.evidence, spec:consumers.spec-studio.lenses
 * @sdpReferences spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function evidencePage(ctx: PageContext): string {
  return frame(
    ctx,
    "Evidence",
    `<header class="page-head"><h1>Evidence</h1><p>Sources of runtime evidence and what would bring each into the Studio.</p></header><ul class="plain-list"><li>Runtime observation: not tracked. An observation the graph records against a measurable target would bring it in.</li><li>Build attestations: not tracked. A Spec that designs this source would bring it in.</li><li>Deployments: not tracked. A Spec that designs this source would bring it in.</li><li>Software bills of materials: not tracked. A Spec that designs this source would bring it in.</li></ul>`,
  );
}
