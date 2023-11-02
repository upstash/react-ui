import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RedisDataTypeUnion, RedisDataTypes } from "@/types";

type Props = {
  onDataTypeChange: (dataType?: RedisDataTypeUnion) => void;
  dataType?: RedisDataTypeUnion;
};

export function DataTypeSelector({ onDataTypeChange, dataType }: Props) {
  const handleValueChange = (data: string) => {
    onDataTypeChange(data as RedisDataTypeUnion);
  };

  return (
    <Select onValueChange={handleValueChange} value={dataType}>
      <SelectTrigger className="inline-flex h-[32px] min-w-[100px] items-center justify-start gap-[5px] rounded-none rounded-r-lg border-[#D9D9D9] text-[14px] capitalize text-[#1F1F1F]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
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
