import { useDatabrowser } from "@/store"
import type { DataType } from "@/types"
import { useQuery } from "@tanstack/react-query"

import { useDeleteKeyCache } from "./use-delete-key-cache"

export const FETCH_SIMPLE_KEY_QUERY_KEY = "fetch-simple-key"

/** Simple key standing for string or json */
export const useFetchSimpleKey = (dataKey: string, type: DataType) => {
  const { redis } = useDatabrowser()
  const { deleteKeyCache } = useDeleteKeyCache()

  return useQuery({
    queryKey: [FETCH_SIMPLE_KEY_QUERY_KEY, dataKey],
    queryFn: async () => {
      let result
      if (type === "string") result = (await redis.get(dataKey)) as string | null
      else if (type === "json") result = (await redis.json.get(dataKey)) as string | null
      else throw new Error(`Invalid type when fetching simple key: ${type}`)

      if (result === null) deleteKeyCache(dataKey)

      return result
    },
  })
}
