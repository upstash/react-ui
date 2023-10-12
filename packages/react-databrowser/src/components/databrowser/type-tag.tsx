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
          "bg-[#0A8633]": value === "string",
          "bg-[#B95816]": value === "list",
          "bg-[#925CBB]": value === "hash",
          "bg-[#016DF2]": value === "set",
          "bg-[#976C13]": value === "json",
          "bg-[#E70F09]": value === "zset",
          "bg-[#626CC5]": value === "stream",
        },
        "mr-0 h-5 px-1 py-0",
        "border-0 text-[11px] font-semibold uppercase leading-none tracking-wide ",
        isFull ? "" : "w-6 p-0",
      )}
    >
      {isFull ? value : value.slice(0, 2)}
    </Badge>
  );
}
