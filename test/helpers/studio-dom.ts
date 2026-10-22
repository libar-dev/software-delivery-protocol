import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

type Listener = () => void;

// A DOM stand-in for the bundled composing elements, including connection and browser events.
export function studioDom(
  script: string,
  href: string,
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
) {
  const definitions = new Map<string, new () => Element>();
  const events = new Map<string, Set<Listener>>();
  const observers = new Map<Element, Listener>();
  const copied: string[] = [];
  const downloads = new Map<string, Blob>();
  let nextUrl = 0;
  class Element {
    tagName = "";
    attributes = new Map<string, string>();
    children: Element[] = [];
    parentElement?: Element;
    ownerDocument = doc;
    className = "";
    value = "";
    type = "";
    download = "";
    href = "";
    declare open: boolean;
    required = false;
    validationMessage = "";
    private ownText = "";
    private listeners = new Map<string, Listener[]>();
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    gather?(intent: { scope: string[]; request: string; action: string; text?: string }): void;
    get textContent(): string {
      return this.ownText + this.children.map((child) => child.textContent).join("");
    }
    set textContent(value: string) {
      this.ownText = value;
      this.children = [];
    }
    setAttribute(key: string, value: string) {
      this.attributes.set(key, value);
      observers.get(this)?.();
    }
    getAttribute(key: string) {
      return this.attributes.get(key) ?? null;
    }
    append(...nodes: (Element | string)[]) {
      for (const node of nodes) {
        const child = typeof node === "string" ? doc.createElement("#text") : node;
        if (typeof node === "string") child.textContent = node;
        child.parentElement = this;
        this.children.push(child);
        if (this === doc.body || this.closest("body")) child.connect();
      }
    }
    private connect() {
      this.connectedCallback?.();
      for (const child of this.children) child.connect();
    }
    replaceChildren(...children: Element[]) {
      for (const child of [...this.children]) child.remove();
      this.ownText = "";
      this.append(...children);
    }
    remove() {
      this.disconnectedCallback?.();
      if (this.parentElement)
        this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
      this.parentElement = undefined;
    }
    matches(selector: string): boolean {
      if (selector.startsWith(".")) return this.className.split(" ").includes(selector.slice(1));
      const match = /^(\w[\w-]*)?(?:\[([\w-]+)(?:="([^"]*)")?\])?$/u.exec(selector);
      return (
        !!match &&
        (!match[1] || this.tagName === match[1]) &&
        (!match[2] ||
          (this.attributes.has(match[2]) &&
            (match[3] === undefined || this.getAttribute(match[2]) === match[3])))
      );
    }
    querySelectorAll(selector: string): Element[] {
      return this.children.flatMap((child) => [
        ...(selector.split(", ").some((part) => child.matches(part)) ? [child] : []),
        ...child.querySelectorAll(selector),
      ]);
    }
    querySelector(selector: string) {
      return this.querySelectorAll(selector)[0] ?? null;
    }
    closest(selector: string): Element | null {
      return this.matches(selector) ? this : (this.parentElement?.closest(selector) ?? null);
    }
    addEventListener(type: string, listener: Listener) {
      this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
    }
    dispatch(type: string) {
      for (const listener of this.listeners.get(type) ?? [])
        Reflect.apply(listener, this, [
          {
            preventDefault() {
              /* No default action in this DOM. */
            },
          },
        ]);
    }
    setCustomValidity(message: string) {
      this.validationMessage = message;
    }
    reportValidity(): boolean {
      return (
        !this.validationMessage &&
        this.querySelectorAll("textarea, input").every(
          (input) => !input.validationMessage && (!input.required || input.value !== ""),
        )
      );
    }
    showModal() {
      this.open = true;
    }
    close() {
      this.open = false;
      this.dispatch("close");
    }
    focus() {
      doc.activeElement = this;
    }
    select() {
      doc.selectedText = this.value;
    }
  }
  const doc = {
    activeElement: null as Element | null,
    selectedText: "",
    location: { href, hash: "" },
    get body(): Element {
      return body;
    },
    createElement(tag: string): Element {
      const Constructor = definitions.get(tag) ?? Element;
      const element = new Constructor();
      element.tagName = tag;
      return element;
    },
    querySelector(selector: string) {
      return body.querySelector(selector);
    },
    querySelectorAll(selector: string) {
      return body.querySelectorAll(selector);
    },
    defaultView: {
      localStorage: storage,
      navigator: {
        clipboard: {
          writeText: (text: string) => {
            copied.push(text);
            return Promise.resolve();
          },
        },
      },
      addEventListener(type: string, listener: Listener) {
        const listeners = events.get(type) ?? new Set<Listener>();
        listeners.add(listener);
        events.set(type, listeners);
      },
      removeEventListener(type: string, listener: Listener) {
        events.get(type)?.delete(listener);
      },
    },
  };
  const body = new Element();
  body.tagName = "body";
  class BrowserURL extends URL {
    static override createObjectURL(blob: Blob) {
      const url = `blob:probe-${String(++nextUrl)}`;
      downloads.set(url, blob);
      return url;
    }
    static override revokeObjectURL(url: string) {
      downloads.delete(url);
    }
  }
  runInNewContext(readFileSync(script, "utf8"), {
    HTMLElement: Element,
    customElements: {
      get: (name: string) => definitions.get(name),
      define: (name: string, constructor: new () => Element) => definitions.set(name, constructor),
    },
    URL: BrowserURL,
    Blob,
    MutationObserver: class {
      constructor(private callback: Listener) {}
      observe(element: Element) {
        observers.set(element, this.callback);
      }
      disconnect() {
        observers.clear();
      }
    },
  });
  return {
    doc,
    copied,
    downloads,
    mount(tag: string, attributes: Record<string, string> = {}) {
      const element = doc.createElement(tag);
      for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
      body.append(element);
      return element;
    },
    event(type: string) {
      for (const listener of events.get(type) ?? []) listener();
    },
  };
}
