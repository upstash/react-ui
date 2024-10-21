import type { PropsWithChildren } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import type { UseInfiniteQueryResult } from "@tanstack/react-query"

export const InfiniteScroll = ({
  query,
  children,
}: PropsWithChildren<{
  query: UseInfiniteQueryResult
}>) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollTop + clientHeight > scrollHeight - 100) {
      if (query.isFetching || !query.hasNextPage) {
        return
      }
      query.fetchNextPage()
    }
  }

  return (
    <div className="h-full w-full overflow-y-scroll" onScroll={handleScroll}>
      {children}
      <div className="flex h-[100px] justify-center py-2 text-zinc-300">
        {query.isFetching && <IconLoader2 className="animate-spin" size={16} />}
      </div>
    </div>
  )
}
