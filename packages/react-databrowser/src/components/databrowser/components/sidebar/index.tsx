import { useDatabrowserStore } from "@/store"

import { Input } from "@/components/ui/input"

import { useKeys } from "../../hooks/use-keys"
import { AddKeyModal } from "../add-key-modal"
import { DisplayDbSize } from "./db-size"
import { Empty } from "./empty"
import { InfiniteScroll } from "./infinite-scroll"
import { KeysList } from "./keys-list"
import { LoadingSkeleton } from "./skeleton-buttons"
import { DataTypeSelector } from "./type-selector"

export function Sidebar() {
  const { keys, query } = useKeys()
  const { setSearchKey, search } = useDatabrowserStore()

  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border p-1">
      <div className="rounded-lg bg-zinc-100 px-3 py-2">
        {/* Meta */}
        <div className="flex h-10 items-center justify-between pl-1">
          <DisplayDbSize />
          <div className="flex gap-1">
            <AddKeyModal />
          </div>
        </div>

        {/* Filter */}
        <div className="flex h-10 items-center">
          {/* Types */}
          <DataTypeSelector />

          {/* Search */}
          <Input
            type="text"
            placeholder="Search"
            className={
              "rounded-l-none border-zinc-300 px-2 font-normal placeholder-zinc-300 focus-visible:ring-0"
            }
            onChange={(e) => setSearchKey(e.target.value)}
            value={search.key}
          />
        </div>
      </div>

      {query.isLoading ? (
        <LoadingSkeleton />
      ) : keys.length > 0 ? (
        <InfiniteScroll query={query}>
          <KeysList />
        </InfiniteScroll>
      ) : (
        <Empty />
      )}
    </div>
  )
}
