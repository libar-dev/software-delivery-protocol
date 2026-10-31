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

export function sourceUrl(template: string, file: string, line: string): string | null {
  if (!template.includes("{file}")) return null;
  const value = template
    .replaceAll("{file}", file.split("/").map(encodeURIComponent).join("/"))
    .replaceAll("{line}", encodeURIComponent(line));
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * Checks the document's protocol before requesting the optional stamp.
 *
 * @sdpAnchor impl:protocol.studio-stamp
 * @sdpSatisfies spec:consumers.spec-studio.page-elements, spec:consumers.spec-studio.sharing
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole interaction
 * @sdpLabel resolves published stamps and source links in the browser
 */
export function registerStamp(): void {
  class Stamp extends globalThis.HTMLElement {
    private generation = 0;
    private observer?: MutationObserver;

    connectedCallback(): void {
      const generation = ++this.generation;
      this.observer?.disconnect();
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
          if (generation !== this.generation || !this.isConnected) return;
          this.textContent = stampText(data);
          if (!this.textContent || typeof data !== "object" || data === null) return;
          const stamp = data as Record<string, unknown>;
          if (typeof stamp.corpusCommit === "string")
            this.setAttribute("data-corpus-commit", stamp.corpusCommit);
          if (typeof stamp.source !== "string") return;
          const template = stamp.source;
          const linkSources = (): void => {
            for (const element of Array.from(
              this.ownerDocument.querySelectorAll("code[data-source-file][data-source-line]"),
            )) {
              if (element.parentElement?.tagName === "A") continue;
              const url = sourceUrl(
                template,
                element.getAttribute("data-source-file") ?? "",
                element.getAttribute("data-source-line") ?? "",
              );
              if (url === null) continue;
              const link = this.ownerDocument.createElement("a");
              link.setAttribute("href", url);
              element.replaceWith(link);
              link.appendChild(element);
            }
          };
          linkSources();
          if (typeof globalThis.MutationObserver === "function") {
            this.observer = new globalThis.MutationObserver(linkSources);
            this.observer.observe(this.ownerDocument.body, { childList: true, subtree: true });
          }
        })
        .catch(() => {
          /* An absent optional stamp leaves no text. */
        });
    }

    disconnectedCallback(): void {
      this.generation++;
      this.observer?.disconnect();
    }
  }
  if (!globalThis.customElements.get("sdp-stamp"))
    globalThis.customElements.define("sdp-stamp", Stamp);
}
