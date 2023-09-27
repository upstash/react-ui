import { RedisDataTypeUnion } from "@/types";
import { useQuery } from "react-query";
import { redis } from "../lib/client";
import { zip } from "../utils";
import { useRef, useState } from "react";

/*
[] Should allow fetching next - prev pages probably using storing cursor for the next page and current cursor
    - Probably should have state for that storing or maybe useRef to avoid rerender
[] Should allow fetching only one data type - string, json, hset -
[] Should reset everything when reload clicked
[] Should have a state somewhere to hold selected key so we can keep fetching details in data display
    - Should have its own useQuery to fetch details
[] Reset query: Using query.remove() and query.refetch() together
*/

const DEFAULT_FETCH_COUNT = 10;
const INITIAL_CURSOR_NUM = 0;
const SCAN_MATCH_ALL = "*";

type Params = {
  dataType?: RedisDataTypeUnion;
  //   moveDirection?: "next" | "prev";
  shouldReset?: boolean;
  query?: string;
};

export const useFetchPaginatedKeys = ({
  dataType,
  query = SCAN_MATCH_ALL,
  shouldReset,
}: Params) => {
  const { current: cursorWatcher } = useRef({
    prevCursor: INITIAL_CURSOR_NUM,
    nextCursor: INITIAL_CURSOR_NUM,
  });
  const selectedDataKeyRef = useRef<[string, RedisDataTypeUnion] | undefined>();

  const { isLoading, error, data } = useQuery({
    queryKey: ["useFetchPaginatedKeys", query],
    queryFn: async () => {
      const rePipeline = redis.pipeline();
      const [nextCursor, keys] = await redis.scan(INITIAL_CURSOR_NUM, {
        count: DEFAULT_FETCH_COUNT,
        match: query,
        type: dataType,
      });
      //   Change cursor before looping through keys
      //   cursorWatcher.prevCursor = cursorWatcher.nextCursor;
      //   cursorWatcher.nextCursor = nextCursor;

      //Feed pipeline with keys
      for (const key in keys) {
        rePipeline.type(keys[key]);
      }

      //Required to transform hashes into actual keys
      const types: RedisDataTypeUnion[] = keys.length ? await rePipeline.exec() : [];
      //["foo", "string"]
      const keyTypePairs: [string, RedisDataTypeUnion][] = zip(keys, types);

      if (!selectedDataKeyRef.current && keyTypePairs.length > 0) {
        selectedDataKeyRef.current = keyTypePairs[0];
      }

      return keyTypePairs;
    },
    retry: 3,
    staleTime: 10000,
    refetchInterval: 10000,
  });
  return { isLoading, error, data };
};
