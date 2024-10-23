import { useCallback } from "react"
import { useDatabrowserStore } from "@/store"

import { queryClient } from "@/lib/clients"

import { FETCH_SIMPLE_KEY_QUERY_KEY } from "./use-fetch-simple-key"
import { FETCH_KEYS_QUERY_KEY, useKeys } from "./use-keys"

export const useDeleteKeyCache = () => {
  const { setSelectedKey } = useDatabrowserStore()
  const { refetch } = useKeys()

  const deleteKeyCache = useCallback(
    (key: string) => {
      setSelectedKey(undefined)
      queryClient.invalidateQueries({
        queryKey: [FETCH_KEYS_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [FETCH_SIMPLE_KEY_QUERY_KEY, key],
      })
      refetch()
    },
    [setSelectedKey, refetch]
  )

  return { deleteKeyCache }
}
