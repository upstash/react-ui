import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { RedisKey, useFetchKeys } from "./useFetchKeys";
import { useDatabrowserStore } from "@/store";
import { useInfiniteQuery } from "@tanstack/react-query";

const KeysContext = createContext<
  | {
      keys: RedisKey[];
      query: ReturnType<typeof useInfiniteQuery>;
      refetch: () => void;
    }
  | undefined
>(undefined);

export const KeysProvider = ({ children }: PropsWithChildren) => {
  const { search: searchState } = useDatabrowserStore();

  const search = useMemo(
    () => ({
      key: searchState.key.includes("*") ? searchState.key : `*${searchState.key}*`,
      type: searchState.type,
    }),
    [searchState],
  );

  const { getPage, resetCache } = useFetchKeys(search);

  const query = useInfiniteQuery({
    queryKey: ["useFetchKeys", search],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      return getPage(pageParam);
    },
    select: (data) => data,
    getNextPageParam: (lastPage, __, lastParam) => {
      return lastPage.hasNextPage ? lastParam + 1 : undefined;
    },
  });

  const refetch = () => {
    resetCache();
    query.refetch();
  };

  const keys = useMemo(() => query.data?.pages.flatMap((page) => page.keys) ?? [], [query.data]);

  return (
    <KeysContext.Provider
      value={{
        keys,
        query,
        refetch,
      }}
    >
      {children}
    </KeysContext.Provider>
  );
};

export const useKeys = () => {
  const context = useContext(KeysContext);
  if (!context) {
    throw new Error("useKeys must be used within a KeysProvider");
  }
  return context;
};

export const useKeyType = (key?: string) => {
  const { keys } = useKeys();

  const type = useMemo(() => keys.find(([k, _]) => k === key), [keys, key]);

  return type?.[1];
};
