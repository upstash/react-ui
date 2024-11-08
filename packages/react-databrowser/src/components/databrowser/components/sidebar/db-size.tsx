import { useDatabrowser } from "@/store"
import { useQuery } from "@tanstack/react-query"

import { formatNumber } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export const FETCH_DB_SIZE_QUERY_KEY = "fetch-db-size"

export const DisplayDbSize = () => {
  const { redis } = useDatabrowser()
  const { data: keyCount } = useQuery({
    queryKey: [FETCH_DB_SIZE_QUERY_KEY],
    queryFn: async () => {
      return await redis.dbsize()
    },
  })

  if (keyCount === undefined) {
    return (
      <div className="flex items-center justify-center gap-1">
        <Skeleton className="h-5 w-10 rounded" />
      </div>
    )
  }
  return <div className="">{formatNumber(keyCount)} Keys</div>
}
