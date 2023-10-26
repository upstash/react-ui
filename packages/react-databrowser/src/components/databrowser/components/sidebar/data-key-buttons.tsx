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
    {dataKeys.map(([dataKey, dataType], index) => {
      const isSelected = selectedDataKey === dataKey;
      return (
        <Fragment key={dataKey}>
          {!isSelected && selectedDataKey !== dataKeys[index - 1]?.[0] && (
            <div className="h-[1px] w-full bg-[#0000000D] first:hidden " />
          )}
          <Button
            className="relative flex w-full items-center justify-start gap-[8px]"
            variant={isSelected ? "default" : "ghost"}
            onClick={() => onDataKeyChange([dataKey, dataType])}
            style={isSelected ? { boxShadow: "0px 1px 2px 0px #0000001A" } : {}}
          >
            <RedisTypeTag value={dataType} className="pointer-events-none" />
            <p className="w-[180px] overflow-hidden truncate whitespace-nowrap text-left text-[14px] font-medium text-[#000000]">
              {dataKey}
            </p>
            {isSelected && (
              <div className="absolute right-3">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.5 5.5L12.5 10.5L7.5 15.5"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            )}
          </Button>
        </Fragment>
      );
    })}
  </>
);
