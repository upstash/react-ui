import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RedisDataTypeUnion, RedisDataTypes } from "@/types";

type Props = {
  onDataTypeChange: (dataType?: RedisDataTypeUnion) => void;
  dataType?: RedisDataTypeUnion;
};

export function DataTypeSelector({ onDataTypeChange, dataType }: Props) {
  return (
    <Select onValueChange={(data) => onDataTypeChange(data as RedisDataTypeUnion)} value={dataType}>
      <SelectTrigger className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px] min-w-[90px]">
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
