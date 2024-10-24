import { useDatabrowser } from "@/store"
import type { SimpleDataType } from "@/types"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_SIMPLE_KEY_QUERY_KEY } from "./use-fetch-simple-key"

export const useSetSimpleKey = (dataKey: string, type: SimpleDataType) => {
  const { redis } = useDatabrowser()
  return useMutation({
    mutationFn: async (value: string) => {
      if (type === "string") {
        await redis.set(dataKey, value)
      } else if (type === "json") {
        await redis.json.set(dataKey, "$", JSON.parse(value))
      } else {
        throw new Error(`Invalid type when setting simple key: ${type}`)
      }
    },
    onSuccess: (_, value) => {
      // Update the cache
      queryClient.setQueryData([FETCH_SIMPLE_KEY_QUERY_KEY, dataKey], value)
      queryClient.invalidateQueries({
        queryKey: [FETCH_SIMPLE_KEY_QUERY_KEY, dataKey],
      })
    },
  })
}
