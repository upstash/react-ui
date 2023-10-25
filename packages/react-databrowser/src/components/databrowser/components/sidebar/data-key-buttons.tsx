import { Button } from "@/components/ui/button";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { RedisDataTypeUnion } from "@/types";
import { Fragment } from "react";

type Props = {
  dataKeys: [string, RedisDataTypeUnion][];
  selectedDataKey?: string;
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};
export const DataKeyButtons = ({ dataKeys, selectedDataKey, onDataKeyChange }: Props) => (
  <>
    {dataKeys.map(([dataKey, dataType], index) => (
      <Fragment key={dataKey}>
        {selectedDataKey !== dataKey && selectedDataKey !== dataKeys[index - 1]?.[0] && (
          <div className="h-[1px] w-full bg-[#0000000D] first:hidden " />
        )}
        <Button
          className="flex w-full justify-start gap-[8px]"
          variant={selectedDataKey === dataKey ? "default" : "ghost"}
          onClick={() => onDataKeyChange([dataKey, dataType])}
          style={selectedDataKey === dataKey ? { boxShadow: "0px 1px 2px 0px #0000001A" } : {}}
        >
          <RedisTypeTag value={dataType} className="pointer-events-none" />
          <p className="w-[180px] overflow-hidden truncate whitespace-nowrap text-left text-[14px] font-medium text-[#000000]">
            {dataKey}
          </p>
        </Button>
      </Fragment>
    ))}
  </>
);
