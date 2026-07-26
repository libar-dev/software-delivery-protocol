/** Assign an author-controlled key as a genuine own property. Plain assignment to a plain object literal hits the inherited `__proto__` setter — silently dropping primitives, and replacing the prototype with object values — so authored content would vanish from the graph with zero findings, fail-open under the honesty law. defineProperty bypasses the setter and keeps plain-object semantics (JSON, spread, Object.keys, toStrictEqual). */
export function setOwn(target: Record<string, unknown>, key: string, value: unknown): void {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
}
