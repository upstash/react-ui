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
    {dataKeys.map(([dataKey, dataType]) => (
      <Fragment key={dataKey}>
        <div className="h-[1px] w-full bg-[#0000000D] first:hidden " />
        <Button
          className="flex w-full justify-start gap-[8px]"
          variant={selectedDataKey === dataKey ? "default" : "ghost"}
          onClick={() => onDataKeyChange([dataKey, dataType])}
        >
          <RedisTypeTag value={dataType} className="pointer-events-none" />
          <span className="line-clamp-1 text-left text-[14px] font-medium text-[#000000]">{dataKey}</span>
        </Button>
      </Fragment>
    ))}
  </>
);
