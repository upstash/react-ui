import { useDatabrowser } from "@/store";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";

//TODO: Address the issue of useEffect taking additional time to reset the cursor when switching between identical data types, which results in unnecessary,
// erroneous calls to the database. This needs to be resolved later.

const INITIAL_CURSOR_NUM = 0;
const DATA_PER_PAGE = 10;

export type Navigation = {
  handlePageChange: (dir: "next" | "prev") => void;
  prevNotAllowed: boolean;
  nextNotAllowed: boolean;
};

export const useFetchSingleDataByKey = (selectedDataKeyTypePair: [string, RedisDataTypeUnion]) => {
  const { redis } = useDatabrowser();

  const timestamp = useMemo(() => Date.now(), [selectedDataKeyTypePair[0]]);
  const cursorStack = useRef<(string | number)[]>([INITIAL_CURSOR_NUM]);
  const listLength = useRef(INITIAL_CURSOR_NUM);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURSOR_NUM);

  const handlePageChange = useCallback(
    (dir: "next" | "prev") => {
      if (dir === "next") {
        setCurrentIndex((prev) => prev + 1);
      } else if (dir === "prev" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    },
    [currentIndex],
  );

  useEffect(() => {
    setCurrentIndex(INITIAL_CURSOR_NUM);
    cursorStack.current = [INITIAL_CURSOR_NUM];
    listLength.current = INITIAL_CURSOR_NUM;
  }, [selectedDataKeyTypePair[0]]);

  const { isLoading, error, data } = useQuery({
    queryKey: [
      "useFetchSingleDataByKey",
      selectedDataKeyTypePair[0],
      cursorStack.current[currentIndex],
      currentIndex,
      timestamp,
    ],
    queryFn: async () => {
      const [key, dataType] = selectedDataKeyTypePair;

      if (dataType === "string") {
        const content = await redis.get<string>(key);
        return { content, type: dataType };
      }

      if (dataType === "zset") {
        const cursorStackNumber = cursorStack.current as number[];
        const [nextCursor, zrangeValue] = await redis.zscan(key, cursorStackNumber[currentIndex], {
          count: DATA_PER_PAGE,
        });
        if (currentIndex === cursorStack.current.length - 1) {
          cursorStack.current.push(nextCursor);
        }
        return { content: transformArray(zrangeValue), type: dataType };
      }

      if (dataType === "hash") {
        const cursorStackNumber = cursorStack.current as number[];
        const [nextCursor, hashValues] = await redis.hscan(key, cursorStackNumber[currentIndex], {
          count: DATA_PER_PAGE,
        });
        if (currentIndex === cursorStack.current.length - 1) {
          cursorStack.current.push(nextCursor);
        }
        return { content: transformArray(hashValues), type: dataType };
      }

      if (dataType === "list") {
        if (listLength.current === 0) {
          listLength.current = await redis.llen(key);
        }
        const start = currentIndex * DATA_PER_PAGE;
        const end = (currentIndex + 1) * DATA_PER_PAGE - 1;
        const list = await redis.lrange(key, start, end);
        return {
          content: list.map((item, idx) => {
            const overallIdx = start + idx + 1;
            const displayIdx = String(overallIdx).padStart(2, "0"); // '01', '02', ..., '50'
            return { value: displayIdx, content: toJsonStringifiable(item, 0) };
          }),
          type: dataType,
        } satisfies { content: ContentValue[]; type: "list" };
      }

      if (dataType === "set") {
        const cursorStackNumber = cursorStack.current as number[];
        const [nextCursor, setValues] = await redis.sscan(key, cursorStackNumber[currentIndex], {
          count: DATA_PER_PAGE,
        });
        if (currentIndex === cursorStack.current.length - 1) {
          cursorStack.current.push(nextCursor);
        }
        return {
          content: setValues.map((item, _) => ({
            value: null,
            content: toJsonStringifiable(item, 0),
          })),
          type: dataType,
        } satisfies { content: ContentValue[]; type: "set" };
      }

      if (dataType === "stream") {
        const cursorStackString = cursorStack.current as string[];
        const result = await redis.xrange(
          key,
          Number(cursorStackString[currentIndex]) === INITIAL_CURSOR_NUM ? "-" : cursorStackString[currentIndex],
          "+",
          DATA_PER_PAGE,
        );

        const transformedData = transformStream(result);
        const nextCursor = transformedData.at(-1)?.value;
        if (currentIndex === cursorStack.current.length - 1) {
          cursorStack.current.push(
            transformedData.length === DATA_PER_PAGE && nextCursor ? nextCursor : INITIAL_CURSOR_NUM,
          );
        }

        return { content: transformedData, type: dataType };
      }

      if (dataType === "json") {
        const result = await redis.eval("return redis.call('JSON.GET', KEYS[1])", [key], []);
        return { content: result as string, type: dataType };
      }
    },
  });

  return {
    isLoading,
    error,
    data,
    navigation: {
      handlePageChange,
      prevNotAllowed: currentIndex === 0,
      nextNotAllowed:
        selectedDataKeyTypePair[1] === "list"
          ? (currentIndex + 1) * 10 >= listLength.current
          : cursorStack.current[currentIndex + 1] === 0,
    } satisfies Navigation,
  };
};

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
function transformStream(result: Record<string, Record<string, unknown>>) {
  return Object.entries(result).map(([key, values]) => ({
    content: Object.entries(values)
      .map(([field, value]) => `${field} ${value}`)
      .join(" "),
    value: key,
  }));
}

export type ContentValue = {
  content: string | number;
  value: string | number | null;
};

function transformArray(inputArray: (string | number)[]): ContentValue[] {
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

const toJsonStringifiable = <T>(content: T, spacing = 2) => {
  try {
    return JSON.stringify(content, null, spacing);
  } catch (_error) {
    return content;
  }
};
