import { deliveryFactNames } from "./schema.js";

/** Authored carriers reserve both the graph names and the camelCase spelling. */
export const deliveryFactSpellings = [...deliveryFactNames, "hasVerifier"] as const;
