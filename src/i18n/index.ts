export { fr } from "./fr";
export { en } from "./en";
export { ar } from "./ar";

export type Language = "fr" | "en" | "ar";
export type Translations = typeof import("./fr").fr;
