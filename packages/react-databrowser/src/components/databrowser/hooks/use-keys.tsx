import { createContext, useCallback, useContext, useMemo, type PropsWithChildren } from "react"
import { useDatabrowserStore } from "@/store"
import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/react-query"

import { useFetchKeys, type RedisKey } from "./use-fetch-keys"

const KeysContext = createContext<
  | {
      keys: RedisKey[]
      query: UseInfiniteQueryResult
      refetch: () => void
    }
  | undefined
>(undefined)

export const FETCH_KEYS_QUERY_KEY = "use-fetch-keys"

export const KeysProvider = ({ children }: PropsWithChildren) => {
  const { search: searchState } = useDatabrowserStore()

  const search = useMemo(
    () => ({
      key: searchState.key.includes("*") ? searchState.key : `*${searchState.key}*`,
      type: searchState.type,
    }),
    [searchState]
  )

  const { getPage, resetCache } = useFetchKeys(search)

  const query = useInfiniteQuery({
    queryKey: [FETCH_KEYS_QUERY_KEY, search],
    initialPageParam: 0,
    queryFn: async ({ pageParam: pageIndex }) => {
      return getPage(pageIndex)
    },
    select: (data) => data,
    getNextPageParam: (lastPage, __, lastPageIndex) => {
      return lastPage.hasNextPage ? lastPageIndex + 1 : undefined
    },
  })

  const refetch = useCallback(() => {
    resetCache()
    query.refetch()
  }, [query, resetCache])

  const keys = useMemo(() => {
    const keys = query.data?.pages.flatMap((page) => page.keys) ?? []

    const keysSet = new Set(keys.map(([key, _]) => key))

    return keys.filter(([key, _]) => keysSet.has(key))
  }, [query.data])

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
  )
}

export const useKeys = () => {
  const context = useContext(KeysContext)
  if (!context) {
    throw new Error("useKeys must be used within a KeysProvider")
  }
  return context
}

export const useKeyType = (key?: string) => {
  const { keys } = useKeys()

  const keyTuple = useMemo(() => keys.find(([k, _]) => k === key), [keys, key])

  return keyTuple?.[1]
}
