import { queryHint, shippedRecipeCategories } from "../../src/cli/recipe-catalog.js";

/** The whole standard error of an `sdp q` call that answers and prints no finding. */
export const answeredStderr = `${queryHint(shippedRecipeCategories())}\n`;
