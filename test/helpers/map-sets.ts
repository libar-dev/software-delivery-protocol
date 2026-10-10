/**
 * Runs `work` and counts the `Map.prototype.set` calls it makes. A grouping that pushes into a
 * bucket sets each bucket once; one that replaces the bucket sets once per unit, so the count
 * tells the two apart without a clock. The method is restored before this returns. No vitest spy
 * is used: a spy whose own bookkeeping touched a Map would count itself.
 */
export function countMapSets<T>(work: () => T): { readonly value: T; readonly sets: number } {
  const descriptor = Object.getOwnPropertyDescriptor(Map.prototype, "set");

  if (descriptor === undefined || typeof descriptor.value !== "function") {
    throw new Error("Map.prototype.set is not a data property");
  }

  const original = descriptor.value as (
    this: Map<unknown, unknown>,
    key: unknown,
    value: unknown,
  ) => Map<unknown, unknown>;
  let sets = 0;

  Object.defineProperty(Map.prototype, "set", {
    ...descriptor,
    value(this: Map<unknown, unknown>, key: unknown, value: unknown): Map<unknown, unknown> {
      sets += 1;
      return original.call(this, key, value);
    },
  });

  try {
    const value = work();
    return { value, sets };
  } finally {
    Object.defineProperty(Map.prototype, "set", descriptor);
  }
}
