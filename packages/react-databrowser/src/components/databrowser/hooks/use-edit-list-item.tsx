import { useDatabrowser } from "@/store"
import type { ListDataType } from "@/types"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_LIST_ITEMS_QUERY_KEY } from "./use-fetch-list-items"

export const useEditListItem = () => {
  const { redis } = useDatabrowser()

  return useMutation({
    mutationFn: async ({
      type,
      dataKey,
      itemKey,
      newKey,
      newValue,
      isNew,
    }: {
      type: ListDataType
      dataKey: string
      itemKey: string
      newKey?: string
      newValue?: string
      isNew?: boolean
    }) => {
      const pipe = redis.pipeline()
      const shouldDelete = !isNew && (newKey === undefined || newKey !== itemKey)

      if (type === "set") {
        if (shouldDelete) {
          pipe.srem(dataKey, itemKey)
        }
        if (newKey) {
          pipe.sadd(dataKey, newKey)
        }
      } else if (type === "zset") {
        if (Number.isNaN(Number(newValue))) {
          throw new Error("Value must be a number for zset data type")
        }

        if (shouldDelete) {
          pipe.zrem(dataKey, itemKey)
        }
        if (newKey) {
          pipe.zadd(dataKey, {
            member: newKey,
            score: Number(newValue),
          })
        }
      } else if (type === "hash") {
        if (shouldDelete) {
          pipe.hdel(dataKey, itemKey)
        }
        if (newKey) {
          pipe.hset(dataKey, {
            [newKey]: newValue,
          })
        }
      } else if (type === "list") {
        if (isNew) {
          pipe.lpush(dataKey, newValue)
        } else {
          const index = Number(itemKey)

          if (Number.isNaN(index)) {
            throw new Error("Index must be a number for list data type")
          }

          pipe.lset(dataKey, index, newValue)
        }
      } else if (type === "stream") {
        throw new Error("Editing stream items is not supported")
      }

      await pipe.exec()
    },
    onSuccess: (_, { type, dataKey }) => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_LIST_ITEMS_QUERY_KEY, dataKey],
      })
    },
  })
}
