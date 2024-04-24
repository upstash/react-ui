import { useDatabrowser } from "@/store";
import type { RedisDataTypeUnion } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { fetchDataOfType } from "./fetch-data-types";
import { DATA_PER_PAGE, INITIAL_CURSOR_NUM } from "./utils";

//TODO: Address the issue of useEffect taking additional time to reset the cursor when switching between identical data types, which results in unnecessary,
// erroneous calls to the database. This needs to be resolved later.

export type Navigation = {
  handlePageChange: (dir: "next" | "prev") => void;
  prevNotAllowed: boolean;
  nextNotAllowed: boolean;
};

export const useFetchSingleDataByKey = (selectedDataKeyTypePair: [string, RedisDataTypeUnion]) => {
  const { redis } = useDatabrowser();

  //Used for correctly resetting inner state of useQuery
  const timestamp = useMemo(() => Date.now(), [selectedDataKeyTypePair[0]]);
  const cursorStack = useRef<(string | number)[]>([INITIAL_CURSOR_NUM]);
  const listLength = useRef(INITIAL_CURSOR_NUM);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURSOR_NUM);

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

  useEffect(() => {
    setCurrentIndex(INITIAL_CURSOR_NUM);
    cursorStack.current = [INITIAL_CURSOR_NUM];
    listLength.current = INITIAL_CURSOR_NUM;
  }, [selectedDataKeyTypePair[0]]);

  const { isLoading, error, data } = useQuery({
    queryKey: [
      "useFetchSingleDataByKey",
      selectedDataKeyTypePair[0],
      cursorStack.current[currentIndex],
      currentIndex,
      timestamp,
    ],
    queryFn: async () => {
      const [key, dataType] = selectedDataKeyTypePair;
      if (Object.keys(fetchDataOfType).includes(dataType)) {
        return fetchDataOfType[dataType as Exclude<RedisDataTypeUnion, "All Types">]({
          key,
          redis,
          cursor: cursorStack.current[currentIndex],
          index: currentIndex,
          cursorStack,
          listLength: dataType === "list" ? listLength : undefined,
        });
      }
        console.error(`Unsupported data type: ${dataType}`);
        return { content: null, type: "unknown", memory: null } satisfies {
          content: null;
          type: "unknown";
          memory: null;
        };
    },
  });

  const isPrevNotAllowed = () => currentIndex === 0;
  const isNextNotAllowedForListType = () => (currentIndex + 1) * DATA_PER_PAGE >= listLength.current;
  const isNextNotAllowedForOtherTypes = () => cursorStack.current[currentIndex + 1] === 0;
  const isNextNotAllowed = () =>
    selectedDataKeyTypePair[1] === "list" ? isNextNotAllowedForListType() : isNextNotAllowedForOtherTypes();

  return {
    isLoading,
    error,
    data,
    navigation: {
      handlePageChange,
      prevNotAllowed: isPrevNotAllowed(),
      nextNotAllowed: isNextNotAllowed(),
    } satisfies Navigation,
  };
};
