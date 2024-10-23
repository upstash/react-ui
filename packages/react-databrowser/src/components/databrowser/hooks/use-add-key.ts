import { useDatabrowser } from "@/store"
import type { DataType } from "@/types"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_KEYS_QUERY_KEY } from "./use-keys"

export const useAddKey = () => {
  const { redis } = useDatabrowser()

  const mutation = useMutation({
    mutationFn: async ({ key, type }: { key: string; type: DataType }) => {
      switch (type) {
      case "set": {
      redis.sadd(key, "value")
      break;
      }
      case "zset": {
      redis.zadd(key, {
          member: "value",
          score: 0,
        })
      break;
      }
      case "hash": {
      redis.hset(key, {
          field: "field",
          value: "value",
        })
      break;
      }
      case "list": {
      redis.lpush(key, "value")
      break;
      }
      case "stream": {
      redis.xadd(key, "*", {
          foo: "bar",
        })
      break;
      }
      case "string": {
      redis.set(key, "value")
      break;
      }
      default: { throw new Error(`Invalid type provided to useAddKey: "${type}"`)
      }
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [FETCH_KEYS_QUERY_KEY],
      }),
  })
  return mutation
}
