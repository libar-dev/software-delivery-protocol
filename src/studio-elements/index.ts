import { registerCopy } from "./copy.js";
import { registerExpander } from "./expander.js";
import { registerFilter } from "./filter.js";
import { registerSearch } from "./search.js";
import { registerSearchResults } from "./search-results.js";
import { registerStamp } from "./stamp.js";

/**
 * Registers the browser interactions from one bundled entry point.
 *
 * @sdpAnchor component:protocol.studio-elements
 * @sdpSatisfies spec:consumers.spec-studio.page-elements
 * @sdpUses component:protocol.reader, component:protocol.projections
 * @sdpLayer edge
 * @sdpContext protocol
 */
registerSearch();
registerSearchResults();
registerFilter();
registerExpander();
registerCopy();
registerStamp();
