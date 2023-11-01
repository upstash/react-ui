import { partition, zip } from "@/lib/utils";
import { useDatabrowser } from "@/store";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "./useDebounce";

export const DEFAULT_FETCH_COUNT = 100;
const INITIAL_CURSOR_NUM = 0;
const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const { redis } = useDatabrowser();

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
    queryKey: ["useFetchPaginatedKeys", debouncedSearchTerm, dataType],
    queryFn: async () => {
      const rePipeline = redis.pipeline();

      let cursor = null;
      const hehe: [string, RedisDataTypeUnion][][] = [];

      while (cursor !== 0) {
        const [nextCursor, keys] = await redis.scan(cursor ?? 0, {
          count: DEFAULT_FETCH_COUNT,
          match: debouncedSearchTerm,
          type: dataType,
        });
        cursor = nextCursor;

        // Feed pipeline with keys
        for (const key of keys) {
          rePipeline.type(key);
        }

        // Required to transform hashes into actual keys
        // Example value: [["foo", "string"],["bar", "json"]]
        const types: RedisDataTypeUnion[] = keys.length ? await rePipeline.exec() : [];
        const zippedKeyValues: [string, RedisDataTypeUnion][] = zip(keys, types);
        hehe.push(zippedKeyValues);
      }
      const transformedData = partition(
        hehe.flatMap((x) => x),
        10,
      );
      return transformedData;
    },
  });

  return {
    isLoading,
    error,
    data: data?.[currentIndex],
    handlePageChange,
    handleSearch,
    reset,
    searchTerm,
    direction: {
      prevNotAllowed: currentIndex === 0,
      nextNotAllowed: currentIndex === (data?.length ?? 0) - 1,
    },
  };
};
