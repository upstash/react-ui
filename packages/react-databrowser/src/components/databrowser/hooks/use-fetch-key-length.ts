import { useDatabrowser } from "@/store"
import { DataType } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const FETCH_KEY_LENGTH_QUERY_KEY = "fetch-key-length"

export const useFetchKeyLength = ({ dataKey, type }: { dataKey: string; type: DataType }) => {
  const { redis } = useDatabrowser()

  return useQuery({
    queryKey: [FETCH_KEY_LENGTH_QUERY_KEY, dataKey],
    queryFn: async () => {
      if (type === "set") return await redis.scard(dataKey)
      else if (type === "zset") return await redis.zcard(dataKey)
      else if (type === "list") return await redis.llen(dataKey)
      else if (type === "hash") return await redis.hlen(dataKey)
      else if (type === "stream") return await redis.xlen(dataKey)
      return null
    },
  })
}
