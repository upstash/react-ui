import { useDatabrowser } from "@/store"
import type { DataType } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const FETCH_KEY_LENGTH_QUERY_KEY = "fetch-key-length"

export const useFetchKeyLength = ({ dataKey, type }: { dataKey: string; type: DataType }) => {
  const { redis } = useDatabrowser()

  return useQuery({
    queryKey: [FETCH_KEY_LENGTH_QUERY_KEY, dataKey],
    queryFn: async () => {
      switch (type) {
        case "set": {
          return await redis.scard(dataKey)
        }
        case "zset": {
          return await redis.zcard(dataKey)
        }
        case "list": {
          return await redis.llen(dataKey)
        }
        case "hash": {
          return await redis.hlen(dataKey)
        }
        case "stream": {
          return await redis.xlen(dataKey)
        }
        // No default
      }
      return null
    },
  })
}
