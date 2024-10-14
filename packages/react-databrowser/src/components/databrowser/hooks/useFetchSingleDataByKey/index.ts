import { useDatabrowser } from "@/store";
import type { DataType } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDataOfType } from "./fetch-data-types";
import { DATA_PER_PAGE, INITIAL_CURSOR } from "./utils";

export const useFetchSingleDataByKey = (key: string, type: DataType) => {
  const { redis } = useDatabrowser();

  //Used for correctly resetting inner state of useQuery
  const cursorStack = useRef<string[]>([INITIAL_CURSOR]);
  const listLength = useRef(INITIAL_CURSOR);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_CURSOR);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setCurrentIndex(INITIAL_CURSOR);
    cursorStack.current = [INITIAL_CURSOR];
    listLength.current = INITIAL_CURSOR;
  }, [selectedDataKeyTypePair[0], dataFetchTimestamp]);

  const { isLoading, error, data } = useQuery({
    queryKey: [
      "useFetchSingleDataByKey",
      selectedDataKeyTypePair[0],
      cursorStack.current[currentIndex],
      currentIndex,
      dataFetchTimestamp,
    ],
    queryFn: async () => {
      const [key, dataType] = selectedDataKeyTypePair;
      if (Object.keys(fetchDataOfType).includes(dataType)) {
        return fetchDataOfType[dataType as Exclude<DataType, "All Types">]({
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
    isLoading || selectedDataKeyTypePair[1] === "list"
      ? isNextNotAllowedForListType()
      : isNextNotAllowedForOtherTypes();

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
