/**
 * The slot micro-notation — the one owned piece of step-text syntax (the plan-12 session record:
 * slot vocabulary lives in step text; explicit binding on children; natural reading is the
 * renderer's job). Two positions, one grammar:
 *
 * - In a parent's example-space vocabulary, a group **declares** a typed parameter slot:
 *   `{n:number}` · `{availability:"in stock"|"out of stock"}` (a single quoted literal declares a
 *   one-value union).
 * - In an example's Given/When/Then, a group **binds** a value — the example's bound point:
 *   `{n: 2}` · `{availability: "in stock"}`. A bare `{n}` or a type-form group in an example is an
 *   **unbound** slot — the concreteness law holds such an example below `defined`.
 *
 * The parse is context-free and total; the *consumer* (vocabulary vs example) interprets the
 * ambiguous single-string form (`{x: "only"}` is a binding in an example, a one-value union in a
 * vocabulary). A brace group that does not open with an identifier is prose, never a slot — the
 * notation polices slots only, and checks never police prose.
 *
 * The **skeleton** — every slot group normalized to `{name}` — is the step's identity: it keys the
 * generated `Step` union and `StepParams`, matches an example's step to its vocabulary entry, and
 * dedupes ("same words, same meaning" — the ubiquitous-language bet at step level).
 */

export type SlotScalar = string | number | boolean;

export type SlotDeclaredType =
  | { readonly kind: "number" }
  | { readonly kind: "string" }
  | { readonly kind: "boolean" }
  | { readonly kind: "enum"; readonly values: readonly string[] };

export type SlotGroup =
  /** `{n}` — a name and nothing else. */
  | { readonly form: "bare"; readonly name: string; readonly raw: string }
  /** `{n:number}` · `{a:"x"|"y"}` — a type after the colon (a declaration form). */
  | {
      readonly form: "typed";
      readonly name: string;
      readonly type: SlotDeclaredType;
      readonly raw: string;
    }
  /** `{n: 2}` · `{a: "x"}` · `{ok: true}` — a scalar literal after the colon (a binding form). */
  | {
      readonly form: "bound";
      readonly name: string;
      readonly value: SlotScalar;
      readonly raw: string;
    }
  /** Identifier-led but the rest parses as neither type nor value — a slot, but unusable. */
  | { readonly form: "malformed"; readonly name: string; readonly raw: string };

const IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;
const NUMBER_PATTERN = /^-?(?:\d+\.?\d*|\.\d+)$/u;

interface RawGroup {
  readonly raw: string;
  readonly inner: string;
  readonly start: number;
  readonly end: number;
}

/**
 * Brace groups are found by a quote-aware scan (a quoted literal may contain `}` or `{`); groups
 * never nest. Degradation stays local (L2's spirit at the lexical level): an unquoted `{` inside
 * an open group abandons the earlier brace as prose and restarts the group there, and an
 * unterminated group is prose only up to the next candidate — a stray brace or quote earlier in
 * the text must never swallow a well-formed binding after it.
 */
function scanBraceGroups(text: string): readonly RawGroup[] {
  const groups: RawGroup[] = [];
  let index = 0;

  while (index < text.length) {
    if (text[index] !== "{") {
      index += 1;
      continue;
    }

    const start = index;
    let cursor = index + 1;
    let inQuote = false;
    let end = -1;
    let restart = -1;

    while (cursor < text.length) {
      const character = text[cursor];

      if (character === '"') {
        inQuote = !inQuote;
      } else if (character === "}" && !inQuote) {
        end = cursor;
        break;
      } else if (character === "{" && !inQuote) {
        restart = cursor;
        break;
      }

      cursor += 1;
    }

    if (restart !== -1) {
      index = restart;
      continue;
    }

    if (end === -1) {
      index = start + 1;
      continue;
    }

    groups.push({
      raw: text.slice(start, end + 1),
      inner: text.slice(start + 1, end),
      start,
      end: end + 1,
    });
    index = end + 1;
  }

  return groups;
}

/** One double-quoted literal, or undefined when `input` is not exactly that. */
function parseQuotedLiteral(input: string): string | undefined {
  const trimmed = input.trim();

  if (trimmed.length < 2 || !trimmed.startsWith('"') || !trimmed.endsWith('"')) {
    return undefined;
  }

  const body = trimmed.slice(1, -1);

  return body.includes('"') ? undefined : body;
}

/** A `"a"|"b"|…` union of two or more quoted literals, or undefined. */
function parseEnumUnion(input: string): readonly string[] | undefined {
  const parts = splitUnionOutsideQuotes(input);

  if (parts.length < 2) {
    return undefined;
  }

  const values: string[] = [];

  for (const part of parts) {
    const literal = parseQuotedLiteral(part);

    if (literal === undefined) {
      return undefined;
    }

    values.push(literal);
  }

  return values;
}

function splitUnionOutsideQuotes(input: string): readonly string[] {
  const parts: string[] = [];
  let current = "";
  let inQuote = false;

  for (const character of input) {
    if (character === '"') {
      inQuote = !inQuote;
      current += character;
      continue;
    }

    if (character === "|" && !inQuote) {
      parts.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  parts.push(current);

  return parts;
}

function parseRhs(
  rhs: string,
):
  | { readonly kind: "type"; readonly type: SlotDeclaredType }
  | { readonly kind: "value"; readonly value: SlotScalar }
  | undefined {
  const trimmed = rhs.trim();

  if (trimmed === "number" || trimmed === "string" || trimmed === "boolean") {
    return { kind: "type", type: { kind: trimmed } };
  }

  const union = parseEnumUnion(trimmed);

  if (union !== undefined) {
    return { kind: "type", type: { kind: "enum", values: union } };
  }

  const literal = parseQuotedLiteral(trimmed);

  if (literal !== undefined) {
    return { kind: "value", value: literal };
  }

  if (NUMBER_PATTERN.test(trimmed)) {
    return { kind: "value", value: Number(trimmed) };
  }

  if (trimmed === "true" || trimmed === "false") {
    return { kind: "value", value: trimmed === "true" };
  }

  return undefined;
}

function parseGroup(group: RawGroup): SlotGroup | undefined {
  const inner = group.inner.trim();
  const colonIndex = inner.indexOf(":");
  const name = (colonIndex === -1 ? inner : inner.slice(0, colonIndex)).trim();

  if (!IDENTIFIER_PATTERN.test(name)) {
    return undefined;
  }

  // `__proto__` in an object literal is the prototype setter, not a property (Annex B) — a slot
  // by this name would generate a params/point literal that silently does the wrong thing at
  // runtime. Malformed keeps it loud: an example using it fails the concreteness law, and no
  // contract ever emits it.
  if (name === "__proto__") {
    return { form: "malformed", name, raw: group.raw };
  }

  if (colonIndex === -1) {
    return { form: "bare", name, raw: group.raw };
  }

  const parsed = parseRhs(inner.slice(colonIndex + 1));

  if (parsed === undefined) {
    return { form: "malformed", name, raw: group.raw };
  }

  return parsed.kind === "type"
    ? { form: "typed", name, type: parsed.type, raw: group.raw }
    : { form: "bound", name, value: parsed.value, raw: group.raw };
}

/** Every slot group in one step text, in authored order. Prose braces are not returned. */
export function parseSlots(text: string): readonly SlotGroup[] {
  const slots: SlotGroup[] = [];

  for (const raw of scanBraceGroups(text)) {
    const parsed = parseGroup(raw);

    if (parsed !== undefined) {
      slots.push(parsed);
    }
  }

  return slots;
}

/**
 * The step's identity: every slot group normalized to `{name}`, prose (brace groups that are not
 * slots included) untouched. Skeletons key the generated contracts and match example steps to
 * vocabulary entries.
 */
export function stepSkeleton(text: string): string {
  let skeleton = "";
  let cursor = 0;

  for (const raw of scanBraceGroups(text)) {
    const parsed = parseGroup(raw);

    if (parsed === undefined) {
      continue;
    }

    skeleton += text.slice(cursor, raw.start) + `{${parsed.name}}`;
    cursor = raw.end;
  }

  return skeleton + text.slice(cursor);
}

/**
 * Natural reading — the renderer's half of the explicit-binding settlement: bound slots read as
 * their value (`a cart with 2 line items` · `every cart item is in stock`), unbound slots keep
 * their `{name}` skeleton so the absence stays visible. One renderer, every consumer (adapter
 * failure messages today; projections tomorrow).
 */
export function renderStepText(text: string): string {
  let rendered = "";
  let cursor = 0;

  for (const raw of scanBraceGroups(text)) {
    const parsed = parseGroup(raw);

    if (parsed === undefined) {
      continue;
    }

    const replacement = parsed.form === "bound" ? String(parsed.value) : `{${parsed.name}}`;
    rendered += text.slice(cursor, raw.start) + replacement;
    cursor = raw.end;
  }

  return rendered + text.slice(cursor);
}

/** The bound slots of one step text, first binding per name wins (ambiguity is loud elsewhere). */
export function boundSlotValues(text: string): ReadonlyMap<string, SlotScalar> {
  const values = new Map<string, SlotScalar>();

  for (const slot of parseSlots(text)) {
    if (slot.form === "bound" && !values.has(slot.name)) {
      values.set(slot.name, slot.value);
    }
  }

  return values;
}

/** True when the step text carries a slot group that binds no value (bare, typed, or malformed). */
export function hasUnboundSlot(text: string): boolean {
  return parseSlots(text).some((slot) => slot.form !== "bound");
}
