import { RedisDataTypeUnion } from "@/types";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

export interface RedisTypeTagProps extends React.HTMLAttributes<HTMLDivElement> {
  value: RedisDataTypeUnion;
  isFull?: boolean;
}

export function RedisTypeTag({ value, isFull = false, className }: RedisTypeTagProps) {
  return (
    <Badge
      className={clsx(
        className,
        "!inline-flex items-center justify-center rounded drop-shadow-sm",
        {
          "bg-green-500": value === "string",
          "bg-orange-500": value === "list",
          "bg-purple-500": value === "hash",
          "bg-blue-500": value === "set",
          "bg-yellow-500": value === "json",
          "bg-red-500": value === "zset",
          "bg-indigo-500": value === "stream",
        },
        "mr-0 h-5 px-1 py-0",
        "border-0 text-[11px] font-semibold uppercase leading-none tracking-wide",
        isFull ? "" : "w-6 p-0",
      )}
    >
      {isFull ? value : value.slice(0, 2)}
    </Badge>
  );
}
