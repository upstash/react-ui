import { zip } from "@/lib/utils";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "./useDebounce";
import { useDatabrowser } from "@/store";

export const DEFAULT_FETCH_COUNT = 10;
const INITIAL_CURSOR_NUM = 0;
const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const { redis } = useDatabrowser();

  const cursorStack = useRef<{ [key: string]: number[] }>({});
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
    [currentIndex],
  );

  //If user doesn't pass any asterisk we add two of them to end and start
  const handleSearch = (query: string) => {
    setSearchTerm(!query.includes("*") ? `*${query}*` : query);
  };

  const reset = () => {
    setCurrentIndex(INITIAL_CURSOR_NUM);
    setSearchTerm(SCAN_MATCH_ALL);
  };

  const { error, data, isLoading } = useQuery({
    queryKey: ["useFetchPaginatedKeys", debouncedSearchTerm, currentIndex, dataType],
    queryFn: async () => {
      const rePipeline = redis.pipeline();

      // nextCursor is only pushed onto the cursorStack when you are at the most recent cursor,
      const [nextCursor, keys] = await redis.scan(
        (cursorStack.current[debouncedSearchTerm] || [INITIAL_CURSOR_NUM])[currentIndex],
        {
          count: DEFAULT_FETCH_COUNT,
          match: debouncedSearchTerm,
          type: dataType,
        },
      );

      // Check if the cursor array exists for the searchTerm; if not, initialize it
      if (!cursorStack.current[debouncedSearchTerm]) {
        cursorStack.current[debouncedSearchTerm] = [INITIAL_CURSOR_NUM];
      }

      // Push the nextCursor only if at the most recent cursor for the specific searchTerm
      if (currentIndex === (cursorStack.current[debouncedSearchTerm] || []).length - 1) {
        cursorStack.current[debouncedSearchTerm].push(nextCursor);
      }

      //Feed pipeline with keys
      for (const key of keys) {
        rePipeline.type(key);
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
    searchTerm,
    direction: {
      prevNotAllowed: currentIndex === 0,
      nextNotAllowed: (cursorStack.current[debouncedSearchTerm] || [])[currentIndex + 1] === 0,
    },
  };
};
