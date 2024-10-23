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
    <div className="flex h-full flex-col rounded-xl border p-1">
      {/* Header */}
      <div className="rounded-lg bg-zinc-100 px-3 py-2">
        {/* Header top */}
        <div className="mb-2 flex justify-between">
          <DisplayDbSize />
          <div className="flex gap-1">
            <AddKeyModal />
          </div>
        </div>
        {/* Header bottom */}
        <div className="flex">
          <DataTypeSelector />
          <Input
            type="text"
            placeholder="Search"
            className={
              "block h-8 rounded-l-none border-zinc-300 px-2 font-normal placeholder-zinc-300 focus-visible:ring-0"
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
