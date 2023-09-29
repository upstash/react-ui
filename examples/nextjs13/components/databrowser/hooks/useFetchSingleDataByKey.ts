import { useQuery } from "react-query";
import { redis } from "../lib/client";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

//TODO: Address the issue of useEffect taking additional time to reset the cursor when switching between identical data types, which results in unnecessary,
// erroneous calls to the database. This needs to be resolved.

const INITIAL_CURSOR_NUM = 0;
const DATA_PER_PAGE = 10;

export type Navigation = {
  handlePageChange: (dir: "next" | "prev") => void;
  prevNotAllowed: boolean;
  nextNotAllowed: boolean;
};

export const useFetchSingleDataByKey = (selectedDataKeyTypePair: [string, RedisDataTypeUnion]) => {
  const cursorStack = useRef([INITIAL_CURSOR_NUM]);
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
    [currentIndex]
  );

  useEffect(() => {
    setCurrentIndex(INITIAL_CURSOR_NUM);
    cursorStack.current = [INITIAL_CURSOR_NUM];
    listLength.current = INITIAL_CURSOR_NUM;
  }, [selectedDataKeyTypePair[0]]);

  const { isLoading, error, data } = useQuery({
    queryKey: [
      "useFetchSingleDataByKey",
      selectedDataKeyTypePair,
      cursorStack.current[currentIndex],
      currentIndex,
    ],
    queryFn: async () => {
      const [key, dataType] = selectedDataKeyTypePair;

      if (dataType === "string") {
        const content = await redis.get<string>(key);
        return { content, type: dataType };
      }

      if (dataType === "zset") {
        const [nextCursor, zrangeValue] = await redis.zscan(
          key,
          cursorStack.current[currentIndex],
          {
            count: DATA_PER_PAGE,
          }
        );
        if (currentIndex === cursorStack.current.length - 1) cursorStack.current.push(nextCursor);
        return { content: transformArray(zrangeValue), type: dataType };
      }

      if (dataType === "hash") {
        const [nextCursor, hashValues] = await redis.hscan(key, cursorStack.current[currentIndex], {
          count: DATA_PER_PAGE,
        });
        if (currentIndex === cursorStack.current.length - 1) cursorStack.current.push(nextCursor);
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
          content: list.map((item, idx) => ({ value: idx, content: item })),
          type: dataType,
        } satisfies { content: ContentValue[]; type: "list" };
      }

      if (dataType === "set") {
        const [nextCursor, setValues] = await redis.sscan(key, cursorStack.current[currentIndex], {
          count: DATA_PER_PAGE,
        });
        if (currentIndex === cursorStack.current.length - 1) cursorStack.current.push(nextCursor);
        return {
          content: setValues.map((item, _) => ({ value: null, content: item.toString() })),
          type: dataType,
        } satisfies { content: ContentValue[]; type: "set" };
      }

      if (dataType === "json") {
        const result = await redis.eval("return redis.call('JSON.GET', KEYS[1])", [key], []);
        return { content: result as JSON, type: dataType };
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

export type ContentValue = {
  content: string;
  value: string | number | null;
};

function transformArray(inputArray: (string | number)[]): ContentValue[] {
  if (inputArray.length % 2 !== 0) throw new Error("The input array length must be even.");

  return inputArray.reduce<ContentValue[]>((acc, curr, idx, src) => {
    if (idx % 2 === 0) {
      if (typeof curr !== "string")
        throw new Error("Invalid key format. Keys should be of type string.");
      acc.push({ content: curr, value: src[idx + 1] });
    }
    return acc;
  }, []);
}
