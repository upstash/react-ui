import { useDatabrowserStore } from "@/store"
import { type DataType } from "@/types"
import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

import { TypeTag } from "../type-tag"
import { Badge, LengthBadge, SizeBadge, TTLBadge } from "./header-badges"
import { KeyActions } from "./key-actions"

export const DisplayHeader = ({
  dataKey,
  type,
  content,
}: {
  content?: string
  dataKey: string
  type: DataType
}) => {
  const size = content?.length
  const length = content?.length

  const { setSelectedListItem } = useDatabrowserStore()

  const handleAddItem = () => {
    setSelectedListItem({ key: type === "stream" ? "*" : "", value: "", isNew: true })
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

      <div className="flex h-10 flex-wrap items-center gap-1.5">
        <TypeTag variant={type} type="badge" />
        <SizeBadge dataKey={dataKey} />
        <LengthBadge dataKey={dataKey} type={type} content={content} />
        {length && <Badge label="Length:">{size}</Badge>}
        <TTLBadge dataKey={dataKey} />
      </div>
    </div>
  )
}
