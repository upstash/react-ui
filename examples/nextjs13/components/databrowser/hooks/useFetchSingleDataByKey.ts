import { useQuery } from "react-query";
import { redis } from "../lib/client";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

// Should use redis.get if its a string data type
//  should use scan for anything else except for string and json and maybe stream!?
//  apply same cursoring logic from other hook
const INITIAL_CURSOR_NUM = 0;

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
            count: 10,
          }
        );
        if (currentIndex === cursorStack.current.length - 1) cursorStack.current.push(nextCursor);
        return { content: transformArray(zrangeValue), type: dataType };
      }

      if (dataType === "hash") {
        const [nextCursor, hashValues] = await redis.hscan(key, cursorStack.current[currentIndex], {
          count: 10,
        });
        if (currentIndex === cursorStack.current.length - 1) cursorStack.current.push(nextCursor);
        return { content: transformArray(hashValues), type: dataType };
      }

      if (dataType === "list") {
        if (listLength.current === 0) {
          listLength.current = await redis.llen(key);
        }
        const start = currentIndex * 10;
        const end = (currentIndex + 1) * 10 - 1;
        const list = await redis.lrange(key, start, end);
        return {
          content: list.map((item, idx) => ({ value: idx, content: item })),
          type: dataType,
        };
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
  value: string | number;
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
