import { readFileSync, realpathSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { packageRoot } from "../package-root.js";

/** The catalog the recipe files and the category index derive from, relative to the package root. */
export const RECIPE_CATALOG = "docs/agent-surface/recipes.md";

/** One row of the catalog's index. */
export interface IndexedRecipe {
  readonly number: number;
  readonly name: string;
  readonly parameters: string;
  readonly use: string;
}

/** One category of the catalog's index, its recipes in the order the index lists them. */
export interface RecipeCategory {
  readonly name: string;
  readonly recipes: readonly IndexedRecipe[];
}

const categoryHeading = /^### (?<name>.+)$/u;
const indexRow =
  /^\| (?<number>\d+) \| (?<name>[^|]+) \| (?<parameters>[^|]+) \| (?<use>[^|]+) \|$/u;
const firstRecipe = /^## \d+\. /u;

/**
 * Reads the categories from the catalog's index: each `### Name` heading before the first numbered
 * recipe, with the index rows under it. A row before any category heading belongs to none, so the
 * recipe check reports it as uncategorized.
 */
export function recipeCategories(catalog: string): readonly RecipeCategory[] {
  const categories: { readonly name: string; readonly recipes: IndexedRecipe[] }[] = [];

  for (const line of catalog.split(/\r?\n/u)) {
    if (firstRecipe.test(line)) break;
    const heading = categoryHeading.exec(line)?.groups?.name;
    if (heading !== undefined) {
      categories.push({ name: heading.trim(), recipes: [] });
      continue;
    }
    const row = indexRow.exec(line)?.groups;
    const category = categories.at(-1);
    if (row === undefined || category === undefined) continue;
    category.recipes.push({
      number: Number(row.number),
      name: (row.name ?? "").trim(),
      parameters: (row.parameters ?? "").trim(),
      use: (row.use ?? "").trim(),
    });
  }

  return categories;
}

let shipped: readonly RecipeCategory[] | undefined;

/** The categories of the catalog the running package ships, read once; none when it is unreadable. */
export function shippedRecipeCategories(): readonly RecipeCategory[] {
  if (shipped === undefined) {
    try {
      shipped = recipeCategories(readFileSync(join(packageRoot(), RECIPE_CATALOG), "utf8"));
    } catch {
      shipped = [];
    }
  }
  return shipped;
}

/** Where a project installs the package, relative to the project's root. */
const INSTALLED_PATH = ["node_modules", "@libar-dev", "software-delivery-protocol"] as const;

/** Whether two paths name one directory once their links resolve; false when either is missing. */
function samePlace(left: string, right: string): boolean {
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

/**
 * The package directory `root` as `cwd` reaches it, ending in `/`: empty at the package root,
 * through `cwd`'s own `node_modules/@libar-dev/software-delivery-protocol` when that path links to
 * `root`, as a package manager links it from its store, and led by `./` when it would start with
 * `-`, so a command never reads the path as an option.
 */
export function packagePrefix(cwd: string, root: string): string {
  const installed = join(cwd, ...INSTALLED_PATH);
  const target = installed !== root && samePlace(installed, root) ? installed : root;
  const path = relative(cwd, target).split(sep).join("/");
  if (path === "") return "";
  return path.startsWith("-") ? `./${path}/` : `${path}/`;
}

/**
 * The running package's directory as the working directory reaches it; empty when it cannot be
 * found.
 */
export function runningPackagePrefix(): string {
  let root: string;
  try {
    root = packageRoot();
  } catch {
    return "";
  }
  return packagePrefix(process.cwd(), root);
}

/**
 * The environment variable in which a runner, such as the reading skill's `scripts/q.mjs`, names
 * the command that runs `sdp q` through it; the call forms then start with that command.
 */
const QUERY_COMMAND_VARIABLE = "SDP_Q_COMMAND";

/** The command the call forms start with: the one a runner names in `env`, else `sdp q`. */
export function queryCommand(env: Readonly<Record<string, string | undefined>>): string {
  const named = env[QUERY_COMMAND_VARIABLE]?.trim() ?? "";
  return named === "" ? "sdp q" : named;
}

/** The line that ends the standard error of every `sdp q` call that answers. */
export function queryHint(categories: readonly RecipeCategory[]): string {
  const count = categories.reduce((sum, category) => sum + category.recipes.length, 0);
  return count === 0
    ? "hint: inside a body, await recipes(N, params) runs catalog recipe N."
    : `hint: run q with no body to list the ${String(count)} recipes by category; inside a body, await recipes(N, params) runs recipe N.`;
}

/** A shell word for `value`: as written when every character is safe, else single-quoted. */
function shellWord(value: string): string {
  return /^[\w@%+=:,./-]+$/u.test(value) ? value : `'${value.replaceAll("'", `'\\''`)}'`;
}

/** How many of a category's recipes its listing line names before it counts the rest. */
const namedPerCategory = 4;

/**
 * What a call with no body prints after its refusal line: each category with its first recipes,
 * then the call forms. `prefix` leads the package's paths so they open from the working directory,
 * and `command` starts each call form.
 */
export function recipeListing(
  categories: readonly RecipeCategory[],
  prefix: string,
  command: string,
): string {
  const lines: string[] = [];

  if (categories.length > 0) {
    lines.push(
      `The recipes by category; ${prefix}${RECIPE_CATALOG} holds each one's parameters and answer:`,
    );
    for (const category of categories) {
      const named = category.recipes
        .slice(0, namedPerCategory)
        .map((recipe) => `${String(recipe.number)} ${recipe.name}`);
      const more = category.recipes.length - named.length;
      if (more > 0) named.push(`and ${String(more)} more`);
      // A recipe name may hold a comma, so recipes part at semicolons.
      lines.push(`  ${category.name}: ${named.join("; ")}`);
    }
    lines.push("");
  }

  const forms = [
    [`${command} '<body>' [--params JSON] [--json]`, "a body, as the argument or on stdin"],
    [
      `${command} "$(cat ${shellWord(`${prefix}dist/recipes/NN-slug.js`)})" --params JSON`,
      "a recipe as shipped",
    ],
    [
      `${command} 'const answer = await recipes(N, {}); return answer'`,
      "a recipe inside your body",
    ],
  ] as const;
  const width = Math.max(...forms.map(([form]) => form.length));
  lines.push("Call forms:", ...forms.map(([form, what]) => `  ${form.padEnd(width)}  ${what}`));

  return lines.join("\n");
}
