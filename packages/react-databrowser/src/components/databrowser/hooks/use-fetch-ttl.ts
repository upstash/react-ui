import { useEffect } from "react"
import { useDatabrowser } from "@/store"
import { useQuery } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

export const useFetchTTL = (dataKey: string) => {
  const { redis } = useDatabrowser()

  const { isLoading, error, data } = useQuery({
    queryKey: ["fetch-ttl", dataKey],
    queryFn: async () => {
      return await redis.ttl(dataKey)
    },
  })

  useEffect(() => {
    if (data === -2) {
      queryClient.invalidateQueries({
        queryKey: ["fetch-ttl", dataKey],
      })
    }
  }, [data === -2])

  return { isLoading, error, data }
}
