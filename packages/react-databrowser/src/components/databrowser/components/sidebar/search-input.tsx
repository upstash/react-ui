import { useDatabrowserStore } from "@/store"
import { IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const SearchInput = () => {
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
