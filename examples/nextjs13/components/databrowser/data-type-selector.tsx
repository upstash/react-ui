import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RedisDataTypes } from "@/types";

export function DataTypeSelector() {
  return (
    <Select>
      <SelectTrigger className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Data Type</SelectLabel>
          {RedisDataTypes.map((dataType) => (
            <SelectItem value={dataType} key={dataType} className="capitalize">
              {dataType}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
