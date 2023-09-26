import { RedisDataTypeUnion } from "@/app/databrowser/page";
import clsx from "clsx";
import { Badge } from "../ui/badge";

export interface RedisTypeTagProps extends React.HTMLAttributes<HTMLDivElement> {
  value: RedisDataTypeUnion;
  size?: "full" | "short";
}

export function RedisTypeTag({ value, size = "full", className }: RedisTypeTagProps) {
  const isFull = size === "full";
  const color: Record<RedisDataTypeUnion, string> = {
    string: "green",
    list: "orange",
    hash: "purple",
    set: "blue",
    zset: "red",
    json: "blue",
  };
  return (
    <Badge
      color={color[value]}
      className={clsx(
        className,
        "!inline-flex items-center justify-center",
        `rounded bg-${color[value]}-500 opacity-90`,
        "mr-0 h-5 px-1 py-0",
        "border-0 text-[11px] font-semibold uppercase leading-none tracking-wide",
        isFull ? "" : "w-6 p-0"
      )}
    >
      {isFull ? value : value.slice(0, 2)}
    </Badge>
  );
}
