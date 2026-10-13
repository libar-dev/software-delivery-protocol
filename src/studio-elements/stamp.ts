export function stampUrl(protocol: string, root: string): string | null {
  return protocol === "http:" || protocol === "https:" ? `${root}stamp.json` : null;
}

export function stampText(stamp: unknown): string {
  if (typeof stamp !== "object" || stamp === null) return "";
  const value = stamp as Record<string, unknown>;
  if (
    typeof value.corpusCommit !== "string" ||
    typeof value.engine !== "string" ||
    typeof value.builtAt !== "string"
  )
    return "";
  return `Corpus ${value.corpusCommit} · ${value.engine} · Built ${value.builtAt}`;
}

/**
 * Checks the document's protocol before requesting the optional stamp.
 *
 * @sdpAnchor impl:studio.stamp
 * @sdpSatisfies spec:consumers.spec-studio.page-elements
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole utility
 */
export function registerStamp(): void {
  class Stamp extends globalThis.HTMLElement {
    private generation = 0;

    connectedCallback(): void {
      const generation = ++this.generation;
      const url = stampUrl(
        this.ownerDocument.location.protocol,
        this.getAttribute("page-root") ?? "",
      );
      this.textContent = "";
      if (url === null) return;
      void globalThis
        .fetch(url)
        .then(async (response) => {
          if (!response.ok) return;
          const data: unknown = await response.json();
          if (generation === this.generation && this.isConnected)
            this.textContent = stampText(data);
        })
        .catch(() => {
          /* An absent optional stamp leaves no text. */
        });
    }

    disconnectedCallback(): void {
      this.generation++;
    }
  }
  if (!globalThis.customElements.get("sdp-stamp"))
    globalThis.customElements.define("sdp-stamp", Stamp);
}
