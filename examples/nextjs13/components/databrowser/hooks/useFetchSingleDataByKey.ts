import { useQuery } from "react-query";
import { redis } from "../lib/client";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useRef, useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURSOR_NUM);

  const handlePageChange = useCallback(
    (dir: "next" | "prev") => {
      console.log({ dir });
      if (dir === "next") {
        setCurrentIndex((prev) => prev + 1);
      } else if (dir === "prev" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    },
    [currentIndex]
  );

  const { isLoading, error, data } = useQuery({
    queryKey: [
      "useFetchSingleDataByKey",
      selectedDataKeyTypePair,
      cursorStack.current[currentIndex],
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

        if (currentIndex === cursorStack.current.length - 1) {
          cursorStack.current.push(nextCursor);
        }

        return { content: transformArray(zrangeValue), type: dataType };
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
      nextNotAllowed: cursorStack.current[currentIndex + 1] === 0,
    } satisfies Navigation,
  };
};

export type ScoredContent = {
  content: string;
  score: number;
};

function transformArray(inputArray: (string | number)[]): ScoredContent[] {
  if (inputArray.length % 2 !== 0) throw new Error("The input array length must be even.");

  return inputArray.reduce<ScoredContent[]>((acc, curr, idx, src) => {
    // Check if the index is even
    if (idx % 2 === 0) {
      if (typeof curr !== "string" || typeof src[idx + 1] !== "number")
        throw new Error("Invalid input format.");
      acc.push({ content: curr, score: src[idx + 1] as number });
    }
    return acc;
  }, []);
}
