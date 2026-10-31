import { embedData } from "../data.js";
import { frame } from "./frame.js";
import type { PageContext } from "./html.js";

/**
 * Embeds the search records beside the results element, before the deferred bundle runs.
 * @sdpAnchor impl:protocol.studio-search-page
 * @sdpSatisfies spec:consumers.spec-studio.search
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 * @sdpLabel publishes search records beside the browser results view
 */
export function searchPage(ctx: PageContext): string {
  return frame(
    ctx,
    "Search",
    `<h1>Search</h1><noscript><p>Search needs JavaScript. <a href="index.html">Browse the index</a>.</p></noscript><script type="application/json" id="sdp-data">${embedData(ctx.data.search)}</script><sdp-search-results></sdp-search-results>`,
  );
}
