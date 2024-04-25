import type { RedisDataTypeUnion } from "@/types";
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
        "!inline-flex items-center justify-center rounded-[26px]",
        {
          "bg-[#16A34A]": value === "string",
          "bg-[#F97316]": value === "list",
          "bg-[#8B5CF6]": value === "hash",
          "bg-[#3B82F6]": value === "set",
          "bg-[#F59E0B]": value === "json",
          "bg-[#EF4444]": value === "zset",
          "bg-[#EC4899]": value === "stream",
        },
        "text-[10px] font-medium uppercase leading-none tracking-wide ",
        isFull ? "h-5 rounded-md p-[6px]" : "h-5 w-5 p-0",
      )}
    >
      {isFull ? value : value[0]}
    </Badge>
  );
}
