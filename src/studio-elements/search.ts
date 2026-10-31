export function searchFragment(term: string): string {
  return `#q=${encodeURIComponent(term)}`;
}

export function searchTerm(fragment: string): string {
  if (!fragment.startsWith("#q=")) return "";
  try {
    return decodeURIComponent(fragment.slice(3));
  } catch {
    return "";
  }
}

export function searchUrl(root: string, term: string): string {
  return `${root}search.html${searchFragment(term)}`;
}

/**
 * Uses the page-root attribute when the native form submits.
 *
 * @sdpAnchor impl:protocol.studio-search-form
 * @sdpSatisfies spec:consumers.spec-studio.page-elements
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole interaction
 * @sdpLabel routes search forms through page-root URLs and fragments
 */
export function registerSearch(): void {
  class Search extends globalThis.HTMLElement {
    private readonly submit = (event: Event): void => {
      event.preventDefault();
      const input = this.querySelector<HTMLInputElement>(
        'input[name="q"], input[type="search"], input[type="text"], input:not([type])',
      );
      this.ownerDocument.defaultView?.location.assign(
        searchUrl(this.getAttribute("page-root") ?? "", input?.value ?? ""),
      );
    };

    connectedCallback(): void {
      this.addEventListener("submit", this.submit);
    }
    disconnectedCallback(): void {
      this.removeEventListener("submit", this.submit);
    }
  }
  if (!globalThis.customElements.get("sdp-search"))
    globalThis.customElements.define("sdp-search", Search);
}
