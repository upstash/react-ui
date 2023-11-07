import { partition, zip } from "@/lib/utils";
import { useDatabrowser } from "@/store";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "./useDebounce";
import { queryClient } from "@/lib/clients";

export const DEFAULT_FETCH_COUNT = 100;
const INITIAL_CURSOR_NUM = 0;
const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const { redis } = useDatabrowser();
  const allTypesIncluded = dataType === "All Types" ? undefined : dataType;

  const [timestamp, setTimeStamp] = useState(Date.now());
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURSOR_NUM);
  const [searchTerm, setSearchTerm] = useState(SCAN_MATCH_ALL);
  const [lastCursor, setLastCursor] = useState(INITIAL_CURSOR_NUM);
  const [page, setPage] = useState(0);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, DEBOUNCE_TIME);
  const compositeKey = `${allTypesIncluded}-${debouncedSearchTerm}-${timestamp}`;
  const [data, setData] = useState<{ [key: string]: [string, RedisDataTypeUnion][][] }>({});

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
    if (searchTerm !== SCAN_MATCH_ALL) {
      setSearchTerm(SCAN_MATCH_ALL);
    } else {
      //Required for hard refresh, but only if search is not present or default
      setTimeStamp(Date.now());
    }
    setCurrentIndex(INITIAL_CURSOR_NUM);
    queryClient.invalidateQueries("useFetchDbSize");
  };

  const { error, isLoading } = useQuery({
    queryKey: ["useFetchPaginatedKeys", compositeKey, page],
    queryFn: async () => {
      const rePipeline = redis.pipeline();

      const pageData: [string, RedisDataTypeUnion][] = [];
      let cursor = lastCursor;

      while (true) {
        const [nextCursor, keys] = await redis.scan(cursor, {
          count: DEFAULT_FETCH_COUNT,
          match: debouncedSearchTerm,
          type: allTypesIncluded,
        });
        // Feed pipeline with keys
        for (const key of keys) {
          rePipeline.type(key);
        }

        const types: RedisDataTypeUnion[] = keys.length ? await rePipeline.exec() : [];
        const zippedKeyValues: [string, RedisDataTypeUnion][] = zip(keys, types);
        pageData.push(...zippedKeyValues);

        // If page is full or cursor reached 0, stop fetching
        if (pageData.length >= 10 || nextCursor === 0) {
          setLastCursor(nextCursor);
          break;
        }

        cursor = nextCursor;
      }

      setData((prevState) => ({
        ...prevState,
        [compositeKey]: [...(prevState[compositeKey] || []), ...partition(pageData, 10)],
      }));
    },
  });

  useEffect(() => {
    const isCurrentAtLastItem = currentIndex === (data?.[compositeKey]?.length ?? 0) - 1;
    if (isCurrentAtLastItem && lastCursor !== 0) {
      setPage((prevState) => prevState + 1);
    }
  }, [currentIndex, compositeKey, lastCursor, data]);

  return {
    isLoading,
    error,
    data: data?.[compositeKey]?.[currentIndex],
    handlePageChange,
    handleSearch,
    reset,
    searchTerm,
    direction: {
      prevNotAllowed: currentIndex === 0,
      nextNotAllowed: currentIndex === (data?.[compositeKey]?.length ?? 0) - 1,
    },
  };
};
