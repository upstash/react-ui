import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { RedisDataTypes, type RedisDataTypeUnion } from "@/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import type { Redis } from "@upstash/redis";

const SCAN_MATCH_ALL = "*";
const DEBOUNCE_TIME = 250;

const PAGE_SIZE = 10;

// Fetch 100 keys every single time
const FETCH_COUNT = 100;

type RedisKey = [string, RedisDataTypeUnion];

function slicePage(keys: RedisKey[], page: number) {
  return keys.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
}

class PaginatedRedis {
  constructor(
    private readonly redis: Redis,
    private readonly searchTerm: string,
    private readonly typeFilter: string | undefined,
  ) {}

  cache: Record<string, { cursor: number; keys: string[] }> = Object.fromEntries(
    RedisDataTypes.map((type) => [type, { cursor: 0, keys: [] }]),
  );
  targetCount = 0;

  private getLength() {
    return Object.values(this.cache).reduce((acc, curr) => acc + curr.keys.length, 0);
  }

  private getKeys() {
    const keys = Object.entries(this.cache).flatMap(([type, { keys }]) => {
      return keys.map((key) => [key, type] as RedisKey);
    });

    const sorted = keys.sort((a, b) => a[0].localeCompare(b[0]));

    return sorted;
  }

  private async fetch() {
    const fetchType = async (type: string) => {
      while (true) {
        const cursor = this.cache[type].cursor;
        if (cursor === -1 || this.getLength() >= this.targetCount) {
          break;
        }

        const [nextCursor, newKeys] = await this.redis.scan(cursor, {
          count: FETCH_COUNT,
          match: this.searchTerm,
          type: type,
        });

        // console.log("< scan", type, newKeys.length, nextCursor === 0 ? "END" : "MORE");

        this.cache[type].keys = [...this.cache[type].keys, ...newKeys];
        this.cache[type].cursor = nextCursor === 0 ? -1 : nextCursor;
      }
    };

    // Fetch pages of each type until they are enough
    const types = this.typeFilter ? [this.typeFilter] : RedisDataTypes;
    await Promise.all(types.map(fetchType));
  }

  isFetching = false;

  private isAllEnded() {
    return (this.typeFilter ? [this.typeFilter] : RedisDataTypes).every((type) => this.cache[type].cursor === -1);
  }

  async getPage(page: number) {
    // console.log("------------- SCAN PAGE", page, "-------------");
    this.targetCount = (page + 1) * PAGE_SIZE;

    if (!this.isFetching) {
      try {
        this.isFetching = true;
        void this.fetch();
      } finally {
        this.isFetching = false;
      }
    }

    // Wait until we have enough
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.getLength() > this.targetCount || this.isAllEnded()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    const hasEnoughForNextPage = this.getLength() > (page + 1) * PAGE_SIZE;

    const hasNextPage = !this.isAllEnded() || hasEnoughForNextPage;

    return {
      keys: slicePage(this.getKeys(), page),
      hasNextPage,
    };
  }
}

const useFetchRedisPage = ({ searchTerm, typeFilter }: { searchTerm: string; typeFilter?: RedisDataTypeUnion }) => {
  const { redis } = useDatabrowser();

  const [resetTime, setResetTime] = useState(Date.now());

  // biome-ignore lint/correctness/useExhaustiveDependencies: We use resetTime to force reset the cache
  const cache = useMemo(
    () => new PaginatedRedis(redis, searchTerm, typeFilter),
    [redis, searchTerm, typeFilter, resetTime],
  );

  const resetPaginationCache = useCallback(() => {
    // Force reset the memoized cache
    setResetTime(Date.now());
  }, []);

  const fetchPage = async (page: number) => {
    return cache.getPage(page);
  };

  return { fetchPage, resetPaginationCache };
};

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const allTypesIncluded = dataType === "All Types" ? undefined : dataType;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState(SCAN_MATCH_ALL);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, DEBOUNCE_TIME);

  const [currentPage, setCurrentPage] = useState(0);

  const { fetchPage, resetPaginationCache } = useFetchRedisPage({
    searchTerm: debouncedSearchTerm,
    typeFilter: allTypesIncluded,
  });

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
      return await fetchPage(currentPage);
    },
  });

  const refreshSearch = useCallback(() => {
    resetPaginationCache();
    setCurrentPage(0);

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
