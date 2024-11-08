import { useDatabrowser } from "@/store"
import type { ListDataType } from "@/types"
import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/lib/clients"

import { FETCH_LIST_ITEMS_QUERY_KEY, transformArray } from "./use-fetch-list-items"

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

      // If newKey is undefined, the item will be deleted
      newKey?: string
      newValue?: string

      // Only used for list data type, uses lpush if true
      isNew?: boolean
    }) => {
      const pipe = redis.pipeline()
      const shouldDelete = !isNew && (newKey === undefined || newKey !== itemKey)

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
          if (Number.isNaN(Number(newValue)) && newKey !== undefined) {
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
          } else if (newKey === undefined) {
            // NOTE: This is how medis does, surprisingly there are no alternatives to this
            const uniqueKey = `__DELETED_${Date.now()}-${Math.random().toString(36).slice(7)}`
            pipe.lset(dataKey, Number(itemKey), uniqueKey)
            pipe.lrem(dataKey, 0, uniqueKey)
          } else {
            if (Number.isNaN(Number(itemKey)))
              throw new TypeError("Index must be a number for list data type")

            pipe.lset(dataKey, Number(itemKey), newValue)
          }

          break
        }
        case "stream": {
          if (!isNew || !newKey) throw new Error("Stream data type is not mutable")
          const opts = transformArray(newValue?.split("\n") ?? []).map(
            ({ key, value }) => [key, value] as const
          )

          pipe.xadd(dataKey, newKey, Object.fromEntries(opts))

          break
        }
        default: {
          throw new Error(`Unsupported data type for editing: ${type}`)
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
