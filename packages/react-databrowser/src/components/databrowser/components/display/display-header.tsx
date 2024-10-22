import { useDatabrowserStore } from "@/store"
import type { DataType } from "@/types"
import { IconChevronDown, IconPlus } from "@tabler/icons-react"

import { formatBytes } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useFetchTTL } from "../../hooks"
import { RedisTypeTag } from "../type-tag"
import { KeyActions } from "./key-actions"
import { TTLPopover } from "./ttl-popover"

export const DisplayHeader = ({
  dataKey,
  type,
  hideBadges,
  content,
}: {
  content?: string
  dataKey: string
  type: DataType
  hideBadges?: boolean
}) => {
  const size = content?.length
  const length = content?.length

  const { setSelectedListItem } = useDatabrowserStore()

  const handleAddItem = () => {
    setSelectedListItem({ key: "", value: "", isNew: true })
  }

  return (
    <div className="rounded-lg bg-zinc-100 px-3 py-2">
      <div className="flex items-center justify-between gap-1">
        <h2 className="my-2 mb-4 flex-grow truncate">
          {dataKey.trim() === "" ? (
            <>
              {`"${dataKey}"`}
              <span className="ml-3 text-sm text-zinc-500">(empty key)</span>
            </>
          ) : (
            dataKey
          )}
        </h2>
        <Button
          onClick={handleAddItem}
          className="h-6 w-6 rounded-md border border-zinc-300 p-0 shadow-sm"
        >
          <IconPlus className="text-zinc-400" size={20} />
        </Button>
        <KeyActions dataKey={dataKey} type={type} content={content} />
      </div>
      {!hideBadges && (
        <div className="flex flex-wrap gap-1">
          <RedisTypeTag type={type} isIcon={false} />
          {size && <Badge label="Size:">{formatBytes(size)}</Badge>}
          {length && <Badge label="Length:">{size}</Badge>}
          <TTLBadge dataKey={dataKey} />
        </div>
      )}
    </div>
  )
}

const TTLBadge = ({ dataKey }: { dataKey: string }) => {
  const { data: ttl } = useFetchTTL(dataKey)

  return (
    <Badge label="TTL:">
      {ttl === undefined ? (
        <Skeleton className="ml-1 h-3 w-[60px] rounded-md opacity-50" />
      ) : (
        <TTLPopover dataKey={dataKey} ttl={ttl}>
          <div className="flex gap-[2px]">
            {ttl === -1 ? "Forever" : `${ttl}s`}
            <IconChevronDown className="mt-[1px] text-zinc-400" size={12} />
          </div>
        </TTLPopover>
      )}
    </Badge>
  )
}

const Badge = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="flex h-6 items-center rounded-md bg-white px-2 text-xs text-zinc-700">
    <span className="mr-[3px] text-zinc-500">{label}</span>
    {children}
  </div>
)
