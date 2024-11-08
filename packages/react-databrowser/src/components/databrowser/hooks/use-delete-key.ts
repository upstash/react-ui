import { useDatabrowser } from "@/store"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_DB_SIZE_QUERY_KEY } from "../components/sidebar/db-size"
import { useDeleteKeyCache } from "./use-delete-key-cache"

export const useDeleteKey = () => {
  const { redis } = useDatabrowser()
  const { deleteKeyCache } = useDeleteKeyCache()

  const deleteKey = useMutation({
    mutationFn: async (key: string) => {
      return Boolean(await redis.del(key))
    },
    onSuccess: (_, key) => {
      deleteKeyCache(key)
      queryClient.invalidateQueries({
        queryKey: [FETCH_DB_SIZE_QUERY_KEY],
      })
    },
  })

  return deleteKey
}
