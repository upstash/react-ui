export const INITIAL_CURSOR_NUM = 0;
export const DATA_PER_PAGE = 10;
/**
 * Transforms a data object into a specific desired array format.
 *
 * Converts an input object like:
 *
 * ```
 * {
 *   "1696942597667-0": {item: 1, item1: 2, item2: 3},
 *   "1696942598807-0": {item: 2}
 * }
 * ```
 *
 * Into an output format like:
 *
 * ```
 * [
 *   {
 *     value: "1696942597667-0",
 *     content: ["item 1", "item1 2", "item2 3"]
 *   },
 *   {
 *     value: "1696942598807-0",
 *     content: ["item 2"]
 *   }
 * ]
 * ```
 */
export function transformStream(result: Record<string, Record<string, unknown>>) {
  return Object.entries(result).map(([key, values]) => ({
    content: Object.entries(values)
      .map(([field, value]) => `${field}:${value}`)
      .join("\n"),
    value: key,
  }));
}

export type ContentValue = {
  content: string | number;
  value: string | number | null;
};

export function transformArray(inputArray: (string | number)[]): ContentValue[] {
  if (inputArray.length % 2 !== 0) {
    throw new Error("The input array length must be even.");
  }

  return inputArray.reduce<ContentValue[]>((acc, curr, idx, src) => {
    if (idx % 2 === 0) {
      if (typeof curr !== "string") {
        throw new Error("Invalid key format. Keys should be of type string.");
      }
      acc.push({ content: toJsonStringifiable(curr, 0), value: src[idx + 1] });
    }
    return acc;
  }, []);
}

export const toJsonStringifiable = <T>(content: T, spacing = 2) => {
  try {
    return JSON.stringify(content, null, spacing);
  } catch (_error) {
    return content;
  }
};
