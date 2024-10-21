import { useDatabrowser } from "@/store"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

export const useDeleteKey = () => {
  const { redis } = useDatabrowser()

  const deleteKey = useMutation({
    mutationFn: async (dataKey: string) => {
      return Boolean(await redis.del(dataKey))
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["useFetchPaginatedKeys"],
      }),
  })

  return deleteKey
}
