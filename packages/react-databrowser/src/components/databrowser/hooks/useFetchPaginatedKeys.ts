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

const dataTypes = RedisDataTypes.filter((type) => type !== "All Types");

class PaginatedRedis {
  constructor(
    private readonly redis: Redis,
    private readonly searchTerm: string,
    private readonly typeFilter: string | undefined,
  ) {
    // console.log("************** RESET");
  }

  cache: Record<string, { cursor: number; keys: string[] }> = Object.fromEntries(
    dataTypes.map((type) => [type, { cursor: 0, keys: [] }]),
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

        // Dedupe here because redis can and will return duplicates for example when
        // a key is deleted because of ttl etc.
        const dedupedSet = new Set([...this.cache[type].keys, ...newKeys]);

        this.cache[type].keys = [...dedupedSet];
        this.cache[type].cursor = nextCursor === 0 ? -1 : nextCursor;
      }
    };

    // Fetch pages of each type until they are enough
    const types = this.typeFilter ? [this.typeFilter] : dataTypes;
    await Promise.all(types.map(fetchType));
  }

  isFetching = false;

  private isAllEnded() {
    return (this.typeFilter ? [this.typeFilter] : dataTypes).every((type) => this.cache[type].cursor === -1);
  }

  async getPage(page: number) {
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
        if (this.getLength() >= this.targetCount || this.isAllEnded()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    const hasEnoughForNextPage = this.getLength() > (page + 1) * PAGE_SIZE;

    const hasNextPage = !this.isAllEnded() || hasEnoughForNextPage;

    // console.log(slicePage(this.getKeys(), page));

    return {
      keys: slicePage(this.getKeys(), page),
      hasNextPage,
    };
  }
}

const useFetchRedisPage = ({
  searchTerm,
  typeFilter,
  page,
}: {
  searchTerm: string;
  typeFilter?: RedisDataTypeUnion;
  page: number;
}) => {
  const { redis } = useDatabrowser();

  const cache = useRef<PaginatedRedis | undefined>(undefined);
  const lastKey = useRef<string | undefined>(undefined);

  const context = useQuery({
    queryKey: ["useFetchPaginatedKeys", searchTerm, typeFilter, page],
    queryFn: async () => {
      const newKey = `${searchTerm}-${typeFilter}`;

      if (!cache.current || lastKey.current !== newKey) {
        cache.current = new PaginatedRedis(redis, searchTerm, typeFilter);
        lastKey.current = newKey;
      }

      return cache.current.getPage(page);
    },
  });

  const resetCache = useCallback(() => {
    cache.current = undefined;
    lastKey.current = undefined;
  }, []);

  return {
    ...context,
    resetCache,
  };
};

export const useFetchPaginatedKeys = (dataType?: RedisDataTypeUnion) => {
  const allTypesIncluded = dataType === "All Types" ? undefined : dataType;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState(SCAN_MATCH_ALL);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, DEBOUNCE_TIME);

  const [currentPage, setCurrentPage] = useState(0);

  const { resetCache, data, isLoading, error } = useFetchRedisPage({
    searchTerm: debouncedSearchTerm,
    typeFilter: allTypesIncluded,
    page: currentPage,
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

  const refreshSearch = useCallback(() => {
    resetCache();
    setCurrentPage(0);

    queryClient.resetQueries({
      queryKey: ["useFetchPaginatedKeys"],
    });

    queryClient.invalidateQueries({
      queryKey: ["useFetchDbSize"],
    });
  }, [resetCache]);

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
