// Exact source serialization boundary proposed by the design, exercised by the evidence audit.
export const escapeLabel = value => String(value).replace(/#/g,'#35;').replace(/"/g,'#quot;').replace(/</g,'#lt;').replace(/>/g,'#gt;').replace(/\r\n|\r|\n/g,' ');
