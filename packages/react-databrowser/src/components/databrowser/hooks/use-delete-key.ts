import { useDatabrowser } from "@/store"
import { useMutation } from "@tanstack/react-query"

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
    },
  })

  return deleteKey
}
