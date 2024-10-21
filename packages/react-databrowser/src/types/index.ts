export const KEY_TYPES = ["string", "list", "hash", "set", "zset", "json", "stream"] as const
export const KEY_NAMES = {
  string: "String",
  list: "List",
  hash: "Hash",
  set: "Set",
  zset: "Sorted Set",
  json: "JSON",
  stream: "Stream",
}

export type DataType = (typeof KEY_TYPES)[number]

const LIST_DATA_TYPES = ["set", "zset", "list", "hash", "stream"] as const
const SIMPLE_DATA_TYPES = ["string", "json"] as const

export type SimpleDataType = (typeof SIMPLE_DATA_TYPES)[number]
export type ListDataType = (typeof LIST_DATA_TYPES)[number]

export type ActionVariants = "reset" | "filter" | "search" | "next" | "prev"
