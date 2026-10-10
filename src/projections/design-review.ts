import type { Reader } from "../reader/reader.js";
import { escapeRenderedField } from "./owned-prose.js";
import { pageHref, pagePathOf } from "./design-review-markdown.js";
import { renderIndexPage, renderPackPage, renderSpecPage } from "./design-review-pages.js";

/**
 * The Design Review — the one MVP read-only human view (`06` §5): a pure projection of the one
 * graph, rendered as Markdown pages (index + one page per spec and per pack). Fully derived and
 * regenerable; consumes **only** the reader (the one decode path — re-joining the graph here
 * would be the consumption-side second store), and links only to source locations the graph
 * records (R2). Pages carry no timestamps and no commit hashes: the view is `f(graph)`, nothing
 * else, so regeneration from the same graph is byte-identical.
 *
 * Views speak binding language (MD-7): the delivery-fact names stay internal; what renders is
 * "Implementation binding / Verifier binding / Runtime observation: not tracked" — bindings,
 * never liveness. Stated readiness renders beside the structurally-reached floor, and the
 * divergence banner fires only in the dishonest direction (`spec:consumers.derived-readiness-banner`).
 */
/**
 * @sdpAnchor impl:protocol.projections-model
 * @sdpLabel pure generated projection page contract
 * @sdpSatisfies spec:consumers.projections-model
 * @sdpComponent component:protocol.projections
 * @sdpRole contract
 */
export interface DesignReviewPage {
  /** POSIX path under the view root (`generated/design-review/`), e.g. `spec/orders.create-order.md`. */
  readonly path: string;
  readonly content: string;
}

/**
 * @sdpAnchor component:protocol.projections
 * @sdpLabel Protocol projections seam
 * @sdpSatisfies spec:consumers.projections-model
 * @sdpUses component:protocol.reader, component:protocol.graph, component:protocol.extract, component:protocol.model, component:protocol.notation, component:protocol.validate
 * @sdpLayer edge
 * @sdpContext protocol
 */

/**
 * @sdpAnchor impl:protocol.design-review
 * @sdpLabel renders the contextual Design Review projection
 * @sdpSatisfies spec:consumers.design-review
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */

/**
 * Renders the full Design Review off the reader. Pure and fs-free: the caller owns writing the
 * pages (and owns the wholesale rewrite that keeps deleted specs from leaving stale pages).
 */
export function renderDesignReview(reader: Reader): readonly DesignReviewPage[] {
  const specs = reader.specs();
  const pages: DesignReviewPage[] = [renderIndexPage(reader, specs)];

  const specLabelFrom = (page: string) => {
    return (id: string): string => {
      const known = specs.find((entry) => entry.id === id);

      return known === undefined
        ? `\`${id}\``
        : `[\`${id}\`](${pageHref(page, pagePathOf(id))})${known.title === undefined ? "" : ` — ${escapeRenderedField(known.title)}`}`;
    };
  };

  for (const spec of specs) {
    const context = reader.specContext(spec.id);

    if (context !== undefined) {
      pages.push(renderSpecPage(context));
    }
  }

  for (const pack of reader.packs()) {
    const context = reader.packContext(pack.id);

    if (context !== undefined) {
      pages.push(renderPackPage(context, specLabelFrom(pagePathOf(pack.id))));
    }
  }

  return pages.sort((left, right) =>
    left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
  );
}
