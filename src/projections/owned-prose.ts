export function escapeRenderedField(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll("&", "&amp;")
    .replaceAll("`", "\\`")
    .replaceAll("|", "\\|")
    .replaceAll("#", "\\#")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderProse(text: string): readonly string[] {
  return text.split("\n").map((line) => escapeRenderedField(line));
}

export function sectionDescription(content: Record<string, unknown>): readonly string[] {
  const description = content.description;

  return typeof description === "string" && description.trim().length > 0
    ? renderProse(description)
    : [];
}

export function renderNarrative(narrative: string | undefined): readonly string[] {
  return narrative === undefined || narrative.trim().length === 0
    ? []
    : ["## Narrative", "", ...renderProse(narrative), ""];
}
