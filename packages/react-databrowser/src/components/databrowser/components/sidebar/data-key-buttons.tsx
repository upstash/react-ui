import { Button } from "@/components/ui/button";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { RedisDataTypeUnion } from "@/types";

type Props = {
  dataKeys: [string, RedisDataTypeUnion][];
  selectedDataKey?: string;
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};
export const DataKeyButtons = ({ dataKeys, selectedDataKey, onDataKeyChange }: Props) => (
  <>
    {dataKeys.map(([dataKey, dataType]) => (
      <Button
        className="w-full"
        variant={selectedDataKey === dataKey ? "default" : "ghost"}
        key={dataKey}
        onClick={() => onDataKeyChange([dataKey, dataType])}
      >
        <span className="line-clamp-1 w-[150px] text-left">{dataKey}</span>
        <RedisTypeTag value={dataType} className="pointer-events-none ml-auto" />
      </Button>
    ))}
  </>
);
