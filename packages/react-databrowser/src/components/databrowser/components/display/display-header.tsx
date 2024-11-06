import { useEffect } from "react"
import { useDatabrowserStore } from "@/store"
import { type DataType } from "@/types"
import { IconChevronDown, IconPlus } from "@tabler/icons-react"
import bytes from "bytes"

import { queryClient } from "@/lib/clients"
import { formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { FETCH_TTL_QUERY_KEY, useFetchTTL } from "../../hooks"
import { useDeleteKeyCache } from "../../hooks/use-delete-key-cache"
import { useFetchKeyLength } from "../../hooks/use-fetch-key-length"
import { useFetchKeySize } from "../../hooks/use-fetch-key-size"
import { TypeTag } from "../type-tag"
import { KeyActions } from "./key-actions"
import { TTLPopover } from "./ttl-popover"

export const DisplayHeader = ({
  dataKey,
  type,
  // hideBadges,
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
      <div className="flex min-h-10 items-center justify-between gap-4">
        <h2 className="grow truncate text-base">
          {dataKey.trim() === "" ? (
            <span className="ml-1 text-zinc-500">(Empty Key)</span>
          ) : (
            <span className="font-semibold">{dataKey}</span>
          )}
        </h2>

        <div className="flex items-center gap-1">
          {type !== "string" && type !== "json" && (
            <Button onClick={handleAddItem} size="icon-sm">
              <IconPlus className="size-4 text-zinc-500" />
            </Button>
          )}

          <KeyActions dataKey={dataKey} content={content} />
        </div>
      </div>

      {/*{!hideBadges && (*/}
      <div className="flex h-10 flex-wrap items-center gap-1.5">
        <TypeTag variant={type} type="badge" />
        <SizeBadge dataKey={dataKey} />
        <LengthBadge dataKey={dataKey} type={type} content={content} />
        {length && <Badge label="Length:">{size}</Badge>}
        <TTLBadge dataKey={dataKey} />
      </div>
      {/*)}*/}
    </div>
  )
}

const LengthBadge = ({
  dataKey,
  type,
  content,
}: {
  dataKey: string
  type: DataType
  content?: string
}) => {
  const { data, isLoading } = useFetchKeyLength({ dataKey, type })

  // If the type is a simple type, the length is the size of the content
  const length = content?.length ?? data

  return (
    <Badge label="Length:">
      {isLoading ? <Skeleton className="ml-1 h-3 w-[60px] rounded-md opacity-50" /> : length}
    </Badge>
  )
}

const SizeBadge = ({ dataKey }: { dataKey: string }) => {
  const { data: size } = useFetchKeySize(dataKey)

  return (
    <Badge label="Size:">
      {size ? (
        bytes(size, {
          unitSeparator: " ",
        })
      ) : (
        <Skeleton className="ml-1 h-3 w-[60px] rounded-md opacity-50" />
      )}
    </Badge>
  )
}

const TTL_INFINITE = -1
const TTL_NOT_FOUND = -2

const TTLBadge = ({ dataKey }: { dataKey: string }) => {
  const { data: ttl } = useFetchTTL(dataKey)
  const { deleteKeyCache } = useDeleteKeyCache()

  // Tick the ttl query every second
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.setQueryData([FETCH_TTL_QUERY_KEY, dataKey], (ttl?: number) => {
        if (ttl === undefined || ttl === TTL_INFINITE) return ttl

        if (ttl <= 1) {
          deleteKeyCache(dataKey)
          return TTL_NOT_FOUND
        }
        return ttl - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Badge label="TTL:">
      {ttl === undefined ? (
        <Skeleton className="ml-1 h-3 w-[60px] rounded-md opacity-50" />
      ) : (
        <TTLPopover dataKey={dataKey} ttl={ttl}>
          <div className="flex gap-[2px]">
            {ttl === TTL_INFINITE ? "Forever" : formatTime(ttl)}
            <IconChevronDown className="mt-[1px] text-zinc-400" size={12} />
          </div>
        </TTLPopover>
      )}
    </Badge>
  )
}

const Badge = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="flex h-6 items-center gap-0.5 rounded-md bg-white px-2 text-xs text-zinc-700">
    <span className="text-zinc-500">{label}</span>
    <span className="font-medium">{children}</span>
  </div>
)
