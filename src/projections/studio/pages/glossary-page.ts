import { frame } from "./frame.js";
import { copy, escape, link } from "./html.js";
import type { PageContext } from "./html.js";
import { codeSpans } from "./text.js";
import { titleLink, total } from "./register-common.js";

/**
 * @sdpAnchor impl:protocol.studio-glossary
 * @sdpSatisfies spec:consumers.spec-studio.glossary-page
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 * @sdpLabel renders Model terms with their entry-address links
 */
export function glossaryPage(ctx: PageContext): string {
  const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
  const terms = ctx.data.specs
    .flatMap((spec) =>
      Object.entries(spec.sections?.model?.terms ?? {}).map(([term, definition]) => {
        const key = Object.keys(spec.sections?.model?.termKeys ?? {}).find(
          (k) => spec.sections?.model?.termKeys?.[k] === term,
        );
        const letter = Array.from(term.toLowerCase())[0] ?? "";
        return {
          spec: spec.id,
          term,
          definition,
          key,
          letter: /^\p{L}$/u.test(letter) ? letter : "#",
        };
      }),
    )
    .sort((a, b) => compare(a.term.toLowerCase(), b.term.toLowerCase()) || compare(a.spec, b.spec));
  const letters = [...new Set(terms.map((t) => t.letter))];
  const letterId = (letter: string) => `letter.${letter === "#" ? "other" : letter}`;
  return frame(
    ctx,
    "Glossary",
    `<header class="page-head"><h1>Glossary</h1><p>${total(terms.length, "term")} defined by ${total(new Set(terms.map((t) => t.spec)).size, "Spec")}.</p><nav aria-label="Term letters">${letters.map((l) => `<a href="#${escape(letterId(l))}">${escape(l)}</a>`).join(" · ")}</nav></header>${
      letters
        .map(
          (letter) =>
            `<section><h2 id="${escape(letterId(letter))}">${escape(letter)}</h2><ul class="plain-list">${terms
              .filter((t) => t.letter === letter)
              .map(
                (t) =>
                  `<li class="spec-row" data-term="${escape(t.term)}"><b>${escape(t.term)}</b> · ${codeSpans(t.definition)}<p>${titleLink(ctx, t.spec)}${t.key === undefined ? "" : ` · ${link(ctx, `${t.spec}#term.${t.key}`, `term.${t.key}`)}${copy(`${t.spec}#term.${t.key}`)}`}</p></li>`,
              )
              .join("")}</ul></section>`,
        )
        .join("") || "<p>No terms defined in Model sections.</p>"
    }`,
  );
}
