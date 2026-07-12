/**
 * Type-level slot parsing — the slot micro-notation read by the COMPILER, as-you-type.
 *
 * `src/notation/slots.ts` is the grammar of record; this file mirrors its two forms with
 * TypeScript template-literal types: a vocabulary step's declaration groups (`{n:number}`,
 * `{availability:"in stock"|"out of stock"}`) parse to an object type of declared slot types,
 * and an example step's binding groups (`{n: 2}`, `{availability: "in stock"}`) parse to an
 * object type of literal values. The skeleton — every group normalized to `{name}` — is the
 * step's identity here exactly as it is at runtime.
 *
 * What that buys: `bindPoint(space)({...})` checks, in the editor and with zero codegen, that
 * every authored example step binds a point in the parent's declared example space — an unknown
 * slot, a wrong value type, an out-of-union literal, a parent-side rename, or an unbound slot
 * (the concreteness law's shape) all redden the authored string itself.
 *
 * The law boundary (why this is DX, never truth): the one-validation-path law (MD-14) is
 * untouched. Nothing here is evaluated into the graph — the graph's truth stays what the
 * extractor statically reifies, and the generated contracts stay the binding seam of record.
 * This surface is editor-time feedback on the AUTHORING side of the TS DSL only.
 *
 * Spike limits (the runtime parser is the tolerant one): canonical authored spacing only —
 * no quote-aware brace scanning, no local degradation, no prose-brace tolerance, and a plain
 * `:` in step prose before a slot group would confuse the match. All of that stays
 * `src/notation/slots.ts`'s job; a promotion of this spike would mirror those rules too.
 */

type Trim<S extends string> = S extends ` ${infer R}`
  ? Trim<R>
  : S extends `${infer R} `
    ? Trim<R>
    : S;

type ScalarTypeName = "number" | "string" | "boolean";

type ScalarOf<T extends ScalarTypeName> = T extends "number"
  ? number
  : T extends "string"
    ? string
    : boolean;

/** `"a"|"b"|…` — a closed union of two or more quoted literals (the enum declaration form). */
type EnumUnionOf<S extends string> = S extends `"${infer V}"|${infer Rest}`
  ? V | EnumUnionOf<Rest>
  : S extends `"${infer V}"`
    ? V
    : never;

/** A declaration group's right-hand side, read as the declared type. */
type DeclaredTypeOf<Rhs extends string> = Trim<Rhs> extends infer R extends string
  ? R extends ScalarTypeName
    ? ScalarOf<R>
    : EnumUnionOf<R>
  : never;

/** A binding group's right-hand side, read as the bound literal value's type. */
type BoundValueOf<Rhs extends string> = Trim<Rhs> extends infer R extends string
  ? R extends `"${infer Lit}"`
    ? Lit
    : R extends "true"
      ? true
      : R extends "false"
        ? false
        : R extends `${infer N extends number}`
          ? N
          : never
  : never;

/** The slots one vocabulary step declares: slot name → declared type. */
export type SlotsOf<S extends string> = S extends `${string}{${infer Name}:${infer Rhs}}${infer Rest}`
  ? { readonly [K in Trim<Name>]: DeclaredTypeOf<Rhs> } & SlotsOf<Rest>
  : unknown;

/** The point one example step binds: slot name → bound literal type. */
export type BindsOf<S extends string> = S extends `${string}{${infer Name}:${infer Rhs}}${infer Rest}`
  ? { readonly [K in Trim<Name>]: BoundValueOf<Rhs> } & BindsOf<Rest>
  : unknown;

/** The step's identity — every slot group normalized to `{name}` (`stepSkeleton`, at the type level). */
export type SkeletonOf<S extends string> = S extends `${infer Pre}{${infer Name}:${infer _Rhs}}${infer Rest}`
  ? `${Pre}{${Trim<Name>}}${SkeletonOf<Rest>}`
  : S;

/** Every slot the whole vocabulary declares — the space's typed dimensions, hoverable. */
export type SpaceDimensions<Space extends ExampleSpaceShape> = SlotsOfAll<
  readonly [...Space["given"], ...Space["when"], ...Space["then"]]
>;

type SlotsOfAll<Steps extends readonly string[]> = Steps extends readonly [
  infer Head extends string,
  ...infer Tail extends string[],
]
  ? SlotsOf<Head> & SlotsOfAll<Tail>
  : unknown;

export interface ExampleSpaceShape {
  readonly given: readonly string[];
  readonly when: readonly string[];
  readonly then: readonly string[];
}

/** True when step `E`'s skeleton matches vocabulary step `V` and every used slot binds a legal value. */
type BindsStep<E extends string, V extends string> = SkeletonOf<E> extends SkeletonOf<V>
  ? BindsOf<E> extends SlotsOf<V>
    ? true
    : false
  : false;

/** True when some step of the vocabulary accepts `E`. */
type InVocabulary<E extends string, Vocab extends readonly string[]> = true extends {
  [I in keyof Vocab]: BindsStep<E, Vocab[I] & string>;
}[number]
  ? true
  : false;

/** A valid step passes through; an invalid one becomes the error shape naming the step verbatim. */
type StepVerdict<E extends string, Vocab extends readonly string[]> =
  InVocabulary<E, Vocab> extends true
    ? E
    : { "this step binds no point in the declared example space": E };

type CheckedSteps<Steps extends readonly string[], Vocab extends readonly string[]> = {
  readonly [I in keyof Steps]: StepVerdict<Steps[I] & string, Vocab>;
};

/** The parent's half — mirrors the DSL's `behavior.exampleSpace` shape. Runtime is identity. */
export function declareExampleSpace<const Space extends ExampleSpaceShape>(space: Space): Space {
  return space;
}

/**
 * The child's half — mirrors the DSL's `behavior.examples[n]` shape. Every step string is
 * checked against the matching vocabulary as it is typed; the compile error quotes the exact
 * authored step.
 */
export function bindPoint<const Space extends ExampleSpaceShape>(space: Space) {
  void space;

  return <const Point extends ExampleSpaceShape>(
    point: Point & {
      readonly given: CheckedSteps<Point["given"], Space["given"]>;
      readonly when: CheckedSteps<Point["when"], Space["when"]>;
      readonly then: CheckedSteps<Point["then"], Space["then"]>;
    },
  ): Point => point;
}
