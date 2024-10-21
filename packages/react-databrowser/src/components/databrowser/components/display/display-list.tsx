import { useMemo } from "react"
import { useDatabrowserStore } from "@/store"
import type { ListDataType } from "@/types"
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

import { useFetchListItems } from "../../hooks/use-fetch-list-items"
import { InfiniteScroll } from "../sidebar/infinite-scroll"
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

  const [keyHeader, valueHeader] = headerLabels[type]

  return (
    <div className="flex h-full flex-col gap-2">
      <DisplayHeader dataKey={dataKey} type={type} hideBadges={selectedListItem !== undefined} />
      {selectedListItem && <ListEditDisplay dataKey={dataKey} type={type} />}
      <div className={cn("min-h-0 flex-grow", selectedListItem && "hidden")}>
        <InfiniteScroll query={query}>
          <table className="w-full flex-grow  text-sm text-zinc-700">
            {type !== "set" && (
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left font-medium">{keyHeader}</th>
                  <th className="px-3 py-2 text-left font-medium">{valueHeader}</th>
                </tr>
              </thead>
            )}
            <tbody>
              <ListItems query={query} type={type} />
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export const ListItems = ({
  type,
  query,
}: {
  type: ListDataType
  query: UseInfiniteQueryResult<
    InfiniteData<{
      keys: ItemData[]
    }>
  >
}) => {
  const { setSelectedListItem } = useDatabrowserStore()
  const keys = useMemo(() => query.data?.pages.flatMap((page) => page.keys) ?? [], [query.data])

  return (
    <>
      {keys.map(({ key, value }, _i) => (
        <tr
          key={key}
          onClick={() => {
            setSelectedListItem(key, value)
          }}
          className="cursor-pointer border-b hover:bg-zinc-100"
        >
          <td className="px-3 py-2">{key}</td>
          {value && <td className="px-3 py-2">{value}</td>}
        </tr>
      ))}
    </>
  )
}

type ItemData = {
  key: string
  value?: string
}
