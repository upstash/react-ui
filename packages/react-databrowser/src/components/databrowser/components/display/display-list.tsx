import { useMemo } from "react"
import { useDatabrowserStore } from "@/store"
import type { ListDataType } from "@/types"
import { IconTrash } from "@tabler/icons-react"
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useEditListItem } from "../../hooks"
import { useFetchListItems } from "../../hooks/use-fetch-list-items"
import { ItemContextMenu } from "../item-context-menu"
import { InfiniteScroll } from "../sidebar/infinite-scroll"
import { DeleteAlertDialog } from "./delete-alert-dialog"
import { DisplayHeader } from "./display-header"
import { ListEditDisplay } from "./display-list-edit"

export const headerLabels = {
  list: ["Index", "Content"],
  hash: ["Field", "Value"],
  zset: ["Value", "Score"],
  stream: ["ID", "Value"],
  set: ["Value", ""],
} as const

export const ListDisplay = ({ dataKey, type }: { dataKey: string; type: ListDataType }) => {
  const { selectedListItem } = useDatabrowserStore()
  const query = useFetchListItems({ dataKey, type })

  return (
    <div className="flex h-full flex-col gap-2">
      <DisplayHeader dataKey={dataKey} type={type} />

      {selectedListItem && <ListEditDisplay dataKey={dataKey} type={type} />}

      <div className={cn("min-h-0 grow", selectedListItem && "hidden")}>
        <InfiniteScroll query={query}>
          <div className="pr-3">
            <table className="w-full">
              <tbody>
                <ListItems dataKey={dataKey} type={type} query={query} />
              </tbody>
            </table>
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}

type ItemData = {
  key: string
  value?: string
}

export const ListItems = ({
  query,
  type,
  dataKey,
}: {
  query: UseInfiniteQueryResult<
    InfiniteData<{
      keys: ItemData[]
    }>
  >
  type: ListDataType
  dataKey: string
}) => {
  const { setSelectedListItem } = useDatabrowserStore()
  const keys = useMemo(() => query.data?.pages.flatMap((page) => page.keys) ?? [], [query.data])
  const { mutate: editItem } = useEditListItem()

  return (
    <>
      {keys.map(({ key, value }, i) => (
        <ItemContextMenu
          key={`${dataKey}-${key}-${i}`}
          dataKey={dataKey}
          type={type}
          itemKey={key}
          itemValue={value}
        >
          <tr
            onClick={() => {
              setSelectedListItem({ key, value })
            }}
            className="h-10 border-b border-b-zinc-100 hover:bg-zinc-50"
          >
            <td
              className={cn(
                "cursor-pointer truncate px-3",
                type === "list" || type === "stream" ? "w-24" : ""
              )}
            >
              {key}
            </td>
            {value !== undefined && (
              <td className={cn("cursor-pointer truncate px-3", type === "zset" ? "w-24" : "")}>
                {value}
              </td>
            )}
            {type !== "stream" && (
              <td width={20} className="px-3">
                <DeleteAlertDialog
                  onDeleteConfirm={(e) => {
                    e.stopPropagation()
                    editItem({
                      type,
                      dataKey,
                      itemKey: key,
                      // For deletion
                      newKey: undefined,
                    })
                  }}
                >
                  <Button size="icon-sm" variant="secondary" onClick={(e) => e.stopPropagation()}>
                    <IconTrash className="size-4 text-zinc-500" />
                  </Button>
                </DeleteAlertDialog>
              </td>
            )}
          </tr>
        </ItemContextMenu>
      ))}
    </>
  )
}
