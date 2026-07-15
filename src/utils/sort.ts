/**
 * Safely extracts a value from an object using a key string.
 */
export function getSafeValue<T>(obj: T, key: string): unknown {
  if (obj && typeof obj === "object" && key in obj) {
    return (obj as Record<string, unknown>)[key];
  }
  return undefined;
}

/**
 * Generic sorting helper for arrays of objects.
 */
export function safeSort<T>(
  array: T[],
  key: string,
  direction: "asc" | "desc",
  customExtract?: (item: T) => string
): T[] {
  return [...array].sort((a, b) => {
    const aVal = customExtract ? customExtract(a) : String(getSafeValue(a, key) ?? "");
    const bVal = customExtract ? customExtract(b) : String(getSafeValue(b, key) ?? "");

    const cmp = aVal.localeCompare(bVal);
    return direction === "asc" ? cmp : -cmp;
  });
}
