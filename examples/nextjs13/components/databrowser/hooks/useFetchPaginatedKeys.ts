import { RedisDataTypeUnion } from "@/types";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { redis } from "../lib/client";
import { zip } from "../utils";

/*
[] Should allow fetching next - prev pages probably using storing cursor for the next page and current cursor
    - Probably should have state for that storing or maybe useRef to avoid rerender
[] Should allow fetching only one data type - string, json, hset -
[] Should have a state somewhere to hold selected key so we can keep fetching details in data display
- Should have its own useQuery to fetch details
[] Should reset everything when reload clicked
[] Reset query: Using query.remove() and query.refetch() together or invalidate
*/

const DEFAULT_FETCH_COUNT = 10;
const INITIAL_CURSOR_NUM = 0;
const SCAN_MATCH_ALL = "*";

type Params = {
  dataType?: RedisDataTypeUnion;
  query?: string;
};

export const useFetchPaginatedKeys = ({ dataType, query = SCAN_MATCH_ALL }: Params) => {
  const cursorStack = useRef([INITIAL_CURSOR_NUM]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePageChange = (dir: "next" | "prev") => {
    if (dir === "next") {
      setCurrentIndex((prev) => prev + 1);
    } else if (dir === "prev" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["useFetchPaginatedKeys", query, cursorStack.current[currentIndex]],
    queryFn: async () => {
      const rePipeline = redis.pipeline();
      const [nextCursor, keys] = await redis.scan(cursorStack.current[currentIndex], {
        count: DEFAULT_FETCH_COUNT,
        match: query,
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
      const keyTypePairs: [string, RedisDataTypeUnion][] = zip(keys, types);

      return keyTypePairs;
    },
  });
  return {
    isLoading,
    error,
    data,
    handlePageChange,
    direction: {
      prevNotAllowed: currentIndex === 0,
      nextNotAllowed: cursorStack.current[currentIndex + 1] === 0,
    },
  };
};
