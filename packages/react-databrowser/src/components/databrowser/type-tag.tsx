import { KEY_NAMES, type DataType } from "@/types";
import colors from "tailwindcss/colors";
import { IconArrowsSort, IconCodeDots, IconHash, IconLayersIntersect, IconList, IconQuote } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const colorsMap = {
  string: colors.sky,
  set: colors.indigo,
  hash: colors.amber,
  json: colors.purple,
  zset: colors.pink,
  list: colors.orange,
  stream: colors.orange,
} as const;

const iconsMap = {
  string: <IconQuote size={16} />,
  set: <IconLayersIntersect size={16} />,
  hash: <IconHash size={16} />,
  json: <IconCodeDots size={16} />,
  zset: <IconArrowsSort size={16} />,
  list: <IconList size={16} />,
  stream: <IconList size={16} />,
} as const;

export function RedisTypeTag({ type, isIcon }: { type: DataType; isIcon?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex h-5 shrink-0 items-center justify-center rounded-md text-xs font-medium leading-none tracking-wide",
        isIcon ? "w-5" : "px-1 uppercase",
      )}
      style={{
        backgroundColor: colorsMap[type][200],
        color: colorsMap[type][800],
      }}
    >
      {isIcon ? iconsMap[type] : KEY_NAMES[type]}
    </div>
  );
}
