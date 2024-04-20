import { queryClient } from "@/lib/clients";
import { partition, zip } from "@/lib/utils";
import { useDatabrowser } from "@/store";
import { RedisDataTypeUnion } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "./useDebounce";

export const DEFAULT_FETCH_COUNT = 100;
const INITIAL_CURSOR_NUM = 0;
const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const { redis } = useDatabrowser();
  const allTypesIncluded = dataType === "All Types" ? undefined : dataType;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [timestamp, setTimeStamp] = useState(Date.now());
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURSOR_NUM);
  const [searchTerm, setSearchTerm] = useState(SCAN_MATCH_ALL);
  const [lastCursor, setLastCursor] = useState(INITIAL_CURSOR_NUM);
  const [page, setPage] = useState(0);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, DEBOUNCE_TIME);
  const [data, setData] = useState<{ [key: string]: [string, RedisDataTypeUnion][][] }>({});
  const compositeKey = useMemo(
    () => `${allTypesIncluded}-${debouncedSearchTerm}-${timestamp}`,
    [allTypesIncluded, debouncedSearchTerm, timestamp],
  );

  const typeCache = useMemo(() => new Map<string, RedisDataTypeUnion>(), []);

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
    if (searchInputRef.current?.value) {
      searchInputRef.current.value = "";
    }
    setCurrentIndex(INITIAL_CURSOR_NUM);
    setLastCursor(INITIAL_CURSOR_NUM);
    queryClient.invalidateQueries("useFetchDbSize");
  };

  const { error, isLoading } = useQuery({
    queryKey: ["useFetchPaginatedKeys", compositeKey, page],
    queryFn: async () => {
      const rePipeline = redis.pipeline();

      const pageData: [string, RedisDataTypeUnion][] = [];
      let cursor = lastCursor;

      // The number of entries SCAN command returns is not
      // exact, 12 is just a starting point
      let currScanCount = 12;

      while (true) {
        const [nextCursor, keys] = await redis.scan(cursor, {
          count: currScanCount,
          match: debouncedSearchTerm,
          type: allTypesIncluded,
        });
        const pipelinedKeyIds: number[] = [];
        const keysAndTypes: [string, RedisDataTypeUnion][] = [];

        // Serialize keys, and feed them to pipeline
        for (let i = 0; i < keys.length; i++) {
          if (typeof keys[i] === "object") {
            keys[i] = JSON.stringify(keys[i]);
          }
          const cacheResult = typeCache.get(keys[i]);
          if (cacheResult) {
            keysAndTypes.push([keys[i], cacheResult]);
          } else {
            // If the key is not in cache, add it to pipeline
            rePipeline.type(keys[i]);
            pipelinedKeyIds.push(i);
            // Giving the wrong type for now
            keysAndTypes.push([keys[i], "string"]);
          }
        }

        // Increase the scan count periodically with a max of 10k
        currScanCount += Math.min(currScanCount * 2, 10_000);

        const types: RedisDataTypeUnion[] = pipelinedKeyIds.length ? await rePipeline.exec() : [];

        // Update the types in the keysAndTypes array with the newly fetched types
        types.forEach((type, index) => {
          const id = pipelinedKeyIds[index];

          keysAndTypes[id][1] = type as RedisDataTypeUnion;
          typeCache.set(keys[id], type as RedisDataTypeUnion);
        });

        pageData.push(...keysAndTypes);

        // If page is full or cursor reached 0, stop fetching
        if (pageData.length >= 10 || nextCursor === 0) {
          setLastCursor(nextCursor);
          break;
        }

        cursor = nextCursor;
      }

      setData((prevState) => {
        const all = [...(prevState[compositeKey] || []), pageData].flat();

        return {
          ...prevState,
          [compositeKey]: partition(all, 10),
        };
      });
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
    direction: {
      prevNotAllowed: currentIndex === 0,
      nextNotAllowed: currentIndex === (data?.[compositeKey]?.length ?? 0) - 1,
    },
    searchInputRef,
  };
};
