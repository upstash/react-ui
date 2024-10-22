import { useEffect } from "react"
import { useDatabrowser } from "@/store"
import { useQuery } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_SIMPLE_KEY_QUERY_KEY } from "./use-fetch-simple-key"

export const FETCH_TTL_QUERY_KEY = "fetch-ttl"

export const useFetchTTL = (dataKey: string) => {
  const { redis } = useDatabrowser()

  const { isLoading, error, data } = useQuery({
    queryKey: [FETCH_TTL_QUERY_KEY, dataKey],
    queryFn: async () => {
      return await redis.ttl(dataKey)
    },
  })

  useEffect(() => {
    if (data === -2) {
      queryClient.invalidateQueries({
        queryKey: [FETCH_SIMPLE_KEY_QUERY_KEY, dataKey],
      })
    }
  }, [data === -2])

  return { isLoading, error, data }
}
