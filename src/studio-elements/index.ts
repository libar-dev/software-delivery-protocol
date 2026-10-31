import { registerCompose } from "./compose.js";
import { registerIntentPanel } from "./intent-panel-element.js";
import { registerScenarioEditor } from "./scenario-editor.js";
import { registerViews } from "./views.js";
import { registerDiagram } from "./diagram.js";
import { registerCopy } from "./copy.js";
import { registerExpander } from "./expander.js";
import { registerFilter } from "./filter.js";
import { registerSearch } from "./search.js";
import { registerSearchResults } from "./search-results.js";
import { registerStamp } from "./stamp.js";

/**
 * Start with proposal.ts for the browser handoff shape and schema checks.
 * Read intent-panel.ts for storage and request partition, then diagram.ts for
 * view-box controls over build-rendered SVG and its text equivalent.
 *
 * Registers the browser interactions from one bundled entry point.
 *
 * @sdpAnchor component:protocol.studio-elements
 * @sdpSatisfies spec:consumers.spec-studio.page-elements, spec:consumers.spec-studio.components
 * @sdpUses component:protocol.reader, component:protocol.projections
 * @sdpLayer edge
 * @sdpContext protocol
 * @sdpRole interaction
 * @sdpLabel optional browser behavior and proposal handoff
 */
registerSearch();
registerSearchResults();
registerFilter();
registerExpander();
registerCopy();
registerStamp();

registerDiagram();

registerViews();

registerIntentPanel();
registerScenarioEditor();
registerCompose();
