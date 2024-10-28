import { DATA_TYPE_NAMES, type DataType } from "@/types"
import {
  IconArrowsSort,
  IconCodeDots,
  IconHash,
  IconLayersIntersect,
  IconList,
  IconQuote,
} from "@tabler/icons-react"
import colors from "tailwindcss/colors"

import { cn } from "@/lib/utils"

const colorsMap = {
  string: colors.sky,
  set: colors.indigo,
  hash: colors.amber,
  json: colors.purple,
  zset: colors.pink,
  list: colors.orange,
  stream: colors.orange,
} as const

const iconsMap = {
  string: <IconQuote size={16} />,
  set: <IconLayersIntersect size={16} />,
  hash: <IconHash size={16} />,
  json: <IconCodeDots size={16} />,
  zset: <IconArrowsSort size={16} />,
  list: <IconList size={16} />,
  stream: <IconList size={16} />,
} as const

export function RedisTypeTag({
  type,
  isIcon,
}: {
  type: DataType
  isIcon?: boolean
}) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md text-xs font-medium leading-none tracking-wide",
        isIcon ? "h-5 w-5" : "h-6 px-1 uppercase"
      )}
      style={{
        backgroundColor: colorsMap[type][200],
        color: colorsMap[type][800],
      }}
    >
      {isIcon ? iconsMap[type] : DATA_TYPE_NAMES[type]}
    </div>
  )
}
