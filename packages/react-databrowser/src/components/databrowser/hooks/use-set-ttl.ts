import { useDatabrowser } from "@/store"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_SIMPLE_KEY_QUERY_KEY } from "./use-fetch-simple-key"
import { FETCH_TTL_QUERY_KEY } from "./use-fetch-ttl"

export const useSetTTL = () => {
  const { redis } = useDatabrowser()

  const updateTTL = useMutation({
    mutationFn: async ({ dataKey, ttl }: { dataKey: string; ttl?: number }) => {
      await (ttl === undefined ? redis.persist(dataKey) : redis.expire(dataKey, ttl))
    },
    onSuccess: (_, { dataKey }) => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_TTL_QUERY_KEY, dataKey],
      })
      queryClient.invalidateQueries({
        queryKey: [FETCH_SIMPLE_KEY_QUERY_KEY, dataKey],
      })
    },
  })
  return updateTTL
}
