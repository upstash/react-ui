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
        variant={selectedDataKey === dataKey ? "default" : "ghost"}
        className="justify-start w-full"
        key={dataKey}
        onClick={() => onDataKeyChange([dataKey, dataType])}
      >
        {dataKey}
        <RedisTypeTag value={dataType} className="ml-auto pointer-events-none" />
      </Button>
    ))}
  </>
);
