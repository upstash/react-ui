import type { PropsWithChildren } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import type { UseInfiniteQueryResult } from "@tanstack/react-query"

import { ScrollArea } from "@/components/ui/scroll-area"

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
    <ScrollArea
      type="always"
      className="block h-full w-full transition-all"
      onScroll={handleScroll}
    >
      {children}

      {/* scroll trigger */}
      <div className="flex h-[100px] justify-center py-2 text-zinc-300">
        {query.isFetching && <IconLoader2 className="animate-spin" size={16} />}
      </div>
    </ScrollArea>
  )
}
