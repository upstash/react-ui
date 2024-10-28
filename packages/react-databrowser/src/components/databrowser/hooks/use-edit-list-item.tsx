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
      const shouldDelete =
        !isNew && (newKey === undefined || newKey !== itemKey)

      switch (type) {
        case "set": {
          if (shouldDelete) {
            pipe.srem(dataKey, itemKey)
          }
          if (newKey) {
            pipe.sadd(dataKey, newKey)
          }

          break
        }
        case "zset": {
          if (Number.isNaN(Number(newValue))) {
            throw new TypeError("Value must be a number for zset data type")
          }

          if (shouldDelete) pipe.zrem(dataKey, itemKey)
          if (newKey)
            pipe.zadd(dataKey, {
              member: newKey,
              score: Number(newValue),
            })

          break
        }
        case "hash": {
          if (shouldDelete) pipe.hdel(dataKey, itemKey)
          if (newKey)
            pipe.hset(dataKey, {
              [newKey]: newValue,
            })

          break
        }
        case "list": {
          if (isNew) {
            pipe.lpush(dataKey, newValue)
          } else {
            if (Number.isNaN(Number(itemKey)))
              throw new TypeError("Index must be a number for list data type")

            pipe.lset(dataKey, Number(itemKey), newValue)
          }

          break
        }
        default: {
          throw new Error("Editing stream items is not supported")
        }
      }

      await pipe.exec()
    },
    onSuccess: (_, { dataKey }) => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_LIST_ITEMS_QUERY_KEY, dataKey],
      })
    },
  })
}
