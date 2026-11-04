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
