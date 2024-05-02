import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { RedisDataTypes, type RedisDataTypeUnion } from "@/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

const PAGE_SIZE = 10;

// Fetch 100 keys every single time
const FETCH_COUNT = 100;

type RedisKey = [string, RedisDataTypeUnion];

class PaginationCache {
  // A cursor of -1 means that the last scan returned a next cursor of 0
  // meaning that there are no more keys to fetch
  data: Record<
    string,
    {
      cursor: number;
      keys: string[];
    }
  >;

  constructor() {
    this.data = {};
    this.reset();
  }

  searchKey = "";

  invalidateCache(searchKey: string) {
    if (this.searchKey !== searchKey) {
      this.reset();
      this.searchKey = searchKey;
    }
  }

  onData({ type, keys, newCursor }: { type: string; keys: string[]; newCursor: number }) {
    const cache = this.data[type];

    cache.keys = [...cache.keys, ...keys];
    cache.cursor = newCursor;
  }

  getKeys(type: string) {
    return this.data[type].keys;
  }

  getCursor(type: string) {
    return this.data[type].cursor;
  }

  getLength() {
    return Object.values(this.data).reduce((acc, curr) => acc + curr.keys.length, 0);
  }

  isAllFinished() {
    return Object.values(this.data).every((cache) => cache.cursor === -1);
  }

  isFinished(type: string) {
    return this.data[type].cursor === -1;
  }

  getAllKeysAndTypes() {
    const allKeys = Object.entries(this.data).flatMap(([type, { keys }]) => {
      return keys.map((key) => [key, type] as RedisKey);
    });

    return allKeys.sort((a, b) => a[0].localeCompare(b[0]));
  }

  reset() {
    console.log("------------ RESET ----------");
    this.data = Object.fromEntries(RedisDataTypes.map((type) => [type, { cursor: 0, keys: [] }]));
  }
}

const useFetchRedisPage = () => {
  const { redis } = useDatabrowser();

  const cache = useMemo(() => new PaginationCache(), []);

  const resetPaginationCache = useCallback(() => {
    cache.reset();
  }, [cache]);

  const getPage = (keys: RedisKey[], page: number) => {
    return keys.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
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
    // If this is a new search, reset the pagination cache
    cache.invalidateCache(`${searchTerm}-${typeFilter}`);

    console.log("> SCAN");

    const requiredLength = (page + 1) * PAGE_SIZE;

    const fetchType = async (type: string) => {
      while (true) {
        if (cache.isFinished(type) || cache.getLength() >= requiredLength) {
          break;
        }

        const [nextCursor, newKeys] = await redis.scan(cache.getCursor(type), {
          count: FETCH_COUNT,
          match: searchTerm,
          type: type,
        });

        // console.log("< scan type", type, "got", newKeys.length, "keys", nextCursor === 0 ? "END" : "MORE");

        cache.onData({ type, keys: newKeys, newCursor: nextCursor === 0 ? -1 : nextCursor });
      }
    };

    if (cache.getLength() < requiredLength) {
      const types = typeFilter ? [typeFilter] : RedisDataTypes;
      await Promise.all(types.map(fetchType));
    }

    const allKeys = cache.getAllKeysAndTypes();

    const hasNextPageReady = cache.getLength() > (page + 1) * PAGE_SIZE;

    const allFinished = typeFilter ? cache.isFinished(typeFilter) : cache.isAllFinished();

    return { keys: getPage(allKeys, page), hasNextPage: hasNextPageReady || !allFinished };
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

  const { error, isLoading, data } = useQuery({
    queryKey: ["useFetchPaginatedKeys", debouncedSearchTerm, allTypesIncluded, currentPage],
    queryFn: async () => {
      console.log("new query");
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

    queryClient.resetQueries({
      queryKey: ["useFetchPaginatedKeys"],
    });

    queryClient.invalidateQueries({
      queryKey: ["useFetchDbSize"],
    });
  }, [resetPaginationCache]);

  return {
    isLoading,
    error,
    data: data?.keys,
    handlePageChange,
    handleSearch,
    refreshSearch,
    direction: {
      prevNotAllowed: currentPage <= 0,
      nextNotAllowed: data ? !data.hasNextPage : true,
    },
    searchInputRef,
  };
};
