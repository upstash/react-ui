import { createContext, useCallback, useContext, useMemo, type PropsWithChildren } from "react"
import { useDatabrowserStore } from "@/store"
import type { DataType } from "@/types"
import type { InfiniteData } from "@tanstack/react-query"
import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { useFetchKeys, type RedisKey } from "./use-fetch-keys"

const KeysContext = createContext<
  | {
      keys: RedisKey[]
      query: UseInfiniteQueryResult
      refetch: () => void
      addArtificalKey: (key: string, type: DataType) => void
    }
  | undefined
>(undefined)

export const FETCH_KEYS_QUERY_KEY = "use-fetch-keys"

type InfData = InfiniteData<{
  keys: RedisKey[]
  hasNextPage: boolean
}>

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

  const addArtificalKey = useCallback(
    (key: string, type: DataType) => {
      queryClient.setQueryData<InfData>([FETCH_KEYS_QUERY_KEY, search], (data) => {
        if (!data) throw new Error("Data is undefined")
        return {
          ...data,
          pages: data.pages.map((page, i) =>
            i === 0 ? { ...page, keys: [[key, type], ...page.keys] } : page
          ),
        }
      })
    },
    [query, search]
  )

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
        addArtificalKey,
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

  const type = useMemo(() => keys.find(([k, _]) => k === key), [keys, key])

  return type?.[1]
}
