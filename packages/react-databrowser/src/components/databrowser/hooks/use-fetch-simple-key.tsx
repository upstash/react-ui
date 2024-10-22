import { useDatabrowser } from "@/store"
import type { DataType } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const FETCH_SIMPLE_KEY_QUERY_KEY = "fetch-simple-key"

/** Simple key standing for string or json */
export const useFetchSimpleKey = (dataKey: string, type: DataType) => {
  const { redis } = useDatabrowser()
  return useQuery({
    queryKey: [FETCH_SIMPLE_KEY_QUERY_KEY, dataKey],
    queryFn: async () => {
      if (type === "string") {
        return (await redis.get(dataKey)) as string | null
      }
      if (type === "json") {
        return (await redis.json.get(dataKey)) as string | null
      }
      throw new Error(`Invalid type when fetching simple key: ${type}`)
    },
  })
}
