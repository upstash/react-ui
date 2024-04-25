import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import type { RedisDataTypeUnion } from "@/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "./useDebounce";

const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

const PAGE_SIZE = 10;
const MAX_SCAN_COUNT = 10_000;

type RedisKey = [string, RedisDataTypeUnion];

const useFetchRedisPage = () => {
  const { redis } = useDatabrowser();

  const [keys, setKeys] = useState<RedisKey[]>([]);

  // A cursor of -1 means that the last scan returned a next cursor of 0
  // meaning that there are no more keys to fetch
  const [cursor, setCursor] = useState(0);

  const [scanKey, setScanKey] = useState("");

  const resetPaginationCache = () => {
    setCursor(0);
    setKeys([]);
  };

  const typeCache = useMemo(() => new Map<string, RedisDataTypeUnion>(), []);

  const getPage = (keys: RedisKey[], page: number) => {
    return keys.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  };

  const fetchTypes = async (keys: string[]) => {
    const rePipeline = redis.pipeline();
    const pipelinedKeyIds: number[] = [];
    const keysAndTypes: RedisKey[] = [];

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

    const types: RedisDataTypeUnion[] = pipelinedKeyIds.length ? await rePipeline.exec() : [];

    // Update the types in the keysAndTypes array with the newly fetched types
    types.forEach((type, index) => {
      const id = pipelinedKeyIds[index];

      keysAndTypes[id][1] = type;
      typeCache.set(keys[id], type);
    });
    return keysAndTypes;
  };

  const fetchPage = async ({
    page,
    searchTerm,
    typeFilter,
  }: {
    page: number;
    searchTerm: string;
    typeFilter?: RedisDataTypeUnion;
  }) => {
    const currScanKey = `${searchTerm}-${typeFilter}`;

    let currKeys = keys;
    let currCursor = cursor;

    // If this is a new search, reset the pagination cache
    if (scanKey !== currScanKey) {
      resetPaginationCache();
      setScanKey(currScanKey);

      currCursor = 0;
      currKeys = [];
    }

    const requiredLength = (page + 1) * PAGE_SIZE;

    // It tries to fetch the remaining keys, but since this
    // is unreliable, it is increased every time
    let fetchCount = requiredLength - currKeys.length;

    // How many keys we need to fetch minimum
    while (true) {
      if (currKeys.length >= requiredLength || currCursor === -1) {
        break;
      }

      console.log("> scan", "cursor", currCursor, "fetchCount", fetchCount, "term", searchTerm);
      const [nextCursor, newKeys] = await redis.scan(currCursor, {
        count: fetchCount,
        match: searchTerm,
        type: typeFilter,
      });

      console.log("< scan", newKeys.length, "keys", nextCursor === 0 ? "LAST" : "MORE");

      const keysAndTypes = await fetchTypes(newKeys);

      currKeys = [...currKeys, ...keysAndTypes];

      fetchCount = Math.min(fetchCount * 2, MAX_SCAN_COUNT);

      if (nextCursor === 0) {
        currCursor = -1;
        break;
      }

      currCursor = nextCursor;
    }

    setCursor(currCursor);
    setKeys(currKeys);

    return { keys: getPage(currKeys, page), hasNextPage: currCursor !== -1 };
  };

  return { fetchPage, resetPaginationCache };
};

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const allTypesIncluded = dataType === "All Types" ? undefined : dataType;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState(SCAN_MATCH_ALL);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, DEBOUNCE_TIME);

  const [currentPage, setCurrentPage] = useState(0);

  const { fetchPage, resetPaginationCache } = useFetchRedisPage();

  const handlePageChange = useCallback(
    (dir: "next" | "prev") => {
      if (dir === "next") {
        setCurrentPage((prev) => prev + 1);
      } else if (dir === "prev" && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    },
    [currentPage],
  );

  // If user doesn't pass any asterisk we add two of them to end and start
  const handleSearch = (query: string) => {
    setSearchTerm(!query.includes("*") ? `*${query}*` : query);
    setCurrentPage(0);
  };

  const { error, isLoading, data, refetch } = useQuery({
    cacheTime: 0,
    retry: false,

    queryKey: ["useFetchPaginatedKeys", debouncedSearchTerm, allTypesIncluded, currentPage],
    queryFn: async () => {
      return await fetchPage({
        page: currentPage,
        searchTerm: debouncedSearchTerm,
        typeFilter: allTypesIncluded,
      });
    },
  });

  const refreshSearch = useCallback(() => {
    setCurrentPage(0);
    resetPaginationCache();
    refetch();

    queryClient.invalidateQueries("useFetchDbSize");
  }, [resetPaginationCache, refetch]);

  return {
    isLoading,
    error,
    data: data?.keys,
    handlePageChange,
    handleSearch,
    refreshSearch,
    direction: {
      prevNotAllowed: currentPage === 0,
      nextNotAllowed: data ? !data.hasNextPage : true,
    },
    searchInputRef,
  };
};
