import { RedisDataTypeUnion } from "@/types";
import { useCallback, useRef, useState } from "react";
import { useQuery } from "react-query";
import { redis } from "../lib/client";
import { zip } from "../utils";
import { useDebounce } from "./useDebounce";

const DEFAULT_FETCH_COUNT = 10;
const INITIAL_CURSOR_NUM = 0;
const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const cursorStack = useRef([INITIAL_CURSOR_NUM]);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURSOR_NUM);
  const [searchTerm, setSearchTerm] = useState(SCAN_MATCH_ALL);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, DEBOUNCE_TIME);

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

  //If user doesn't pass any asterisk we add two of them to end and start
  const handleSearch = (query: string) => {
    setSearchTerm(!query.includes("*") ? `*${query}*` : query);
  };

  // Accepts optional callback to reset states that lives in host component
  const reset = (cb?: () => void) => {
    cb?.();
    cursorStack.current = [INITIAL_CURSOR_NUM];
    setCurrentIndex(INITIAL_CURSOR_NUM);
    setSearchTerm(SCAN_MATCH_ALL);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: [
      "useFetchPaginatedKeys",
      debouncedSearchTerm,
      cursorStack.current[currentIndex],
      dataType,
    ],
    queryFn: async () => {
      const rePipeline = redis.pipeline();
      const [nextCursor, keys] = await redis.scan(cursorStack.current[currentIndex], {
        count: DEFAULT_FETCH_COUNT,
        match: debouncedSearchTerm,
        type: dataType,
      });

      // nextCursor is only pushed onto the cursorStack when you are at the most recent cursor,
      if (currentIndex === cursorStack.current.length - 1) {
        cursorStack.current.push(nextCursor);
      }

      //Feed pipeline with keys
      for (const key in keys) {
        rePipeline.type(keys[key]);
      }

      //Required to transform hashes into actual keys
      const types: RedisDataTypeUnion[] = keys.length ? await rePipeline.exec() : [];
      //Example value: [["foo", "string"],["bar", "json"]]
      const keyTypePairs = zip(keys, types);

      return keyTypePairs;
    },
  });
  return {
    isLoading,
    error,
    data,
    handlePageChange,
    handleSearch,
    reset,
    direction: {
      prevNotAllowed: currentIndex === 0,
      nextNotAllowed: cursorStack.current[currentIndex + 1] === 0,
    },
  };
};
