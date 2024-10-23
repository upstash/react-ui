import { useDatabrowser } from "@/store"
import { DataType } from "@/types"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_KEYS_QUERY_KEY } from "./use-keys"

export const useAddKey = () => {
  const { redis } = useDatabrowser()

  const mutation = useMutation({
    mutationFn: async ({ key, type }: { key: string; type: DataType }) => {
      if (type === "set") redis.sadd(key, "value")
      else if (type === "zset")
        redis.zadd(key, {
          member: "value",
          score: 0,
        })
      else if (type === "hash")
        redis.hset(key, {
          field: "field",
          value: "value",
        })
      else if (type === "list") redis.lpush(key, "value")
      else if (type === "stream")
        redis.xadd(key, "*", {
          foo: "bar",
        })
      else if (type === "string") redis.set(key, "value")
      else throw new Error(`Invalid type provided to useAddKey: "${type}"`)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [FETCH_KEYS_QUERY_KEY],
      }),
  })
  return mutation
}
