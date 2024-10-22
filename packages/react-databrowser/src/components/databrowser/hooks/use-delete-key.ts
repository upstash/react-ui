import { useDatabrowser } from "@/store"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_KEYS_QUERY_KEY } from "./use-keys"

export const useDeleteKey = () => {
  const { redis } = useDatabrowser()

  const deleteKey = useMutation({
    mutationFn: async (key: string) => {
      return Boolean(await redis.del(key))
    },
    onSuccess: (_, key) =>
      queryClient.invalidateQueries({
        queryKey: [FETCH_KEYS_QUERY_KEY, key],
      }),
  })

  return deleteKey
}
