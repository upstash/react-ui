import { useDatabrowserStore } from "@/store"
import { IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
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
          <KeySearch />
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

const KeySearch = () => {
  const { setSearchKey, search } = useDatabrowserStore()

  return (
    <div className="relative grow">
      <Input
        placeholder="Search"
        className={"rounded-l-none border-zinc-300 font-normal"}
        onChange={(e) => setSearchKey(e.target.value)}
        value={search.key}
      />
      {search.key && (
        <Button
          type="button"
          variant="link"
          size="icon"
          className="absolute right-1 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={() => {
            setSearchKey("")
          }}
        >
          <IconX size={16} />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  )
}
