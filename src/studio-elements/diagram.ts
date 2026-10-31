/// <reference lib="dom" />
import { button } from "./dom.js";
export interface ViewBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
export function zoomViewBox(
  view: ViewBox,
  scale: number,
  x = view.x + view.width / 2,
  y = view.y + view.height / 2,
): ViewBox {
  const factor = Math.max(0.1, Math.min(10, scale));
  return {
    x: x + (view.x - x) * factor,
    y: y + (view.y - y) * factor,
    width: view.width * factor,
    height: view.height * factor,
  };
}
/**
 * @sdpAnchor impl:protocol.studio-diagram-element
 * @sdpLabel adds view-box pan, zoom and pinch to build-rendered SVG without changing its layout
 * @sdpSatisfies spec:consumers.spec-studio.diagrams, spec:consumers.spec-studio.responsive, spec:consumers.spec-studio.export, spec:consumers.spec-studio.components, spec:consumers.spec-studio.diagram-kinds.legibility
 * @sdpReferences spec:decisions.studio-diagram-renderer, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole interaction
 */
export function registerDiagram(): void {
  class Diagram extends globalThis.HTMLElement {
    private svg: SVGSVGElement | null = null;
    private original: ViewBox = { x: 0, y: 0, width: 1, height: 1 };
    private view = this.original;
    private controls: HTMLElement | null = null;
    private dragged = false;
    private printed?: ViewBox;
    private readonly beforePrint = (): void => {
      this.printed ??= this.view;
      this.view = this.original;
      this.draw();
    };
    private readonly afterPrint = (): void => {
      if (this.printed) {
        this.view = this.printed;
        this.printed = undefined;
        this.draw();
      }
    };
    private readonly pointers = new Map<number, { x: number; y: number }>();
    private draw(): void {
      this.svg?.setAttribute(
        "viewBox",
        `${String(this.view.x)} ${String(this.view.y)} ${String(this.view.width)} ${String(this.view.height)}`,
      );
    }
    private zoom(scale: number): void {
      this.view = zoomViewBox(this.view, scale);
      this.draw();
    }
    connectedCallback(): void {
      if (this.controls) return;
      this.svg = this.querySelector("svg");
      if (!this.svg) return;
      const box = this.svg.viewBox.baseVal;
      this.original = { x: box.x, y: box.y, width: box.width, height: box.height };
      this.view = this.original;
      this.controls = this.ownerDocument.createElement("div");
      this.controls.className = "diagram-controls";
      this.controls.setAttribute("role", "group");
      this.controls.setAttribute("aria-label", "Diagram view");
      for (const [label, action] of [
        [
          "Zoom in",
          () => {
            this.zoom(0.8);
          },
        ],
        [
          "Zoom out",
          () => {
            this.zoom(1.25);
          },
        ],
        [
          "Reset",
          () => {
            this.view = this.original;
            const viewport = this.querySelector<HTMLElement>(".diagram-scroll");
            if (viewport) {
              viewport.scrollLeft = 0;
              viewport.scrollTop = 0;
            }
            this.draw();
          },
        ],
      ] as const) {
        const control = button(this, label);
        control.addEventListener("click", action);
        this.controls.append(control);
      }
      this.querySelector("figcaption")?.after(this.controls);
      this.svg.style.touchAction = "none";
      this.ownerDocument.defaultView?.addEventListener("beforeprint", this.beforePrint);
      this.ownerDocument.defaultView?.addEventListener("afterprint", this.afterPrint);
      this.svg.addEventListener("click", this.handleClick);
      this.svg.addEventListener("pointerdown", this.down);
      this.svg.addEventListener("pointermove", this.move);
      this.svg.addEventListener("pointerup", this.up);
      this.svg.addEventListener("pointercancel", this.up);
      this.svg.addEventListener("wheel", this.wheel, { passive: false });
    }
    private readonly down = (e: PointerEvent): void => {
      if (e.button !== 0) return;
      if (this.pointers.size === 0) this.dragged = false;
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };
    private readonly up = (e: PointerEvent): void => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size === 0)
        queueMicrotask(() => {
          this.dragged = false;
        });
    };
    private readonly move = (e: PointerEvent): void => {
      const before = this.pointers.get(e.pointerId),
        svg = this.svg;
      if (!before || !svg) return;
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (Math.hypot(e.clientX - before.x, e.clientY - before.y) > 3) this.dragged = true;
      if (!this.dragged && this.pointers.size < 2) return;
      svg.setPointerCapture(e.pointerId);
      const other = [...this.pointers.entries()].find(([id]) => id !== e.pointerId)?.[1];
      if (other) {
        const oldDistance = Math.hypot(before.x - other.x, before.y - other.y),
          distance = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        if (distance > 0 && oldDistance > 0) this.zoom(oldDistance / distance);
      } else
        this.view = {
          ...this.view,
          x: this.view.x - ((e.clientX - before.x) * this.view.width) / rect.width,
          y: this.view.y - ((e.clientY - before.y) * this.view.height) / rect.height,
        };
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.draw();
    };
    private readonly handleClick = (event: MouseEvent): void => {
      if (this.dragged) event.preventDefault();
    };
    private readonly wheel = (e: WheelEvent): void => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      this.zoom(e.deltaY > 0 ? 1.1 : 1 / 1.1);
    };
    disconnectedCallback(): void {
      this.ownerDocument.defaultView?.removeEventListener("beforeprint", this.beforePrint);
      this.ownerDocument.defaultView?.removeEventListener("afterprint", this.afterPrint);
      this.afterPrint();
      this.svg?.removeEventListener("click", this.handleClick);
      this.svg?.removeEventListener("pointerdown", this.down);
      this.svg?.removeEventListener("pointermove", this.move);
      this.svg?.removeEventListener("pointerup", this.up);
      this.svg?.removeEventListener("pointercancel", this.up);
      this.svg?.removeEventListener("wheel", this.wheel);
      if (this.svg) this.svg.style.touchAction = "";
      this.pointers.clear();
      this.controls?.remove();
      this.controls = null;
    }
  }
  if (!globalThis.customElements.get("sdp-diagram"))
    globalThis.customElements.define("sdp-diagram", Diagram);
}
