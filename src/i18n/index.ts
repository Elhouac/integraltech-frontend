export { fr } from "./fr";
export { en } from "./en";

export type Language = "fr" | "en";
export type Translations = typeof import("./fr").fr;
