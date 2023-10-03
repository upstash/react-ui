import { RedisDataTypeUnion } from "@/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Separator } from "../../../ui/separator";
import { Skeleton } from "../../../ui/skeleton";
import { useFetchPaginatedKeys } from "../../hooks/useFetchPaginatedKeys";
import { RedisTypeTag } from "../../type-tag";
import { DataTypeSelector } from "./data-type-selector";
import { queryClient } from "../..";

type Props = {
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
  selectedDataKey?: string;
};

export function Sidebar({ onDataKeyChange, selectedDataKey }: Props) {
  const [selectedDataType, setSelectedDataType] = useState<RedisDataTypeUnion>();
  const {
    data: dataKeys,
    isLoading,
    error,
    handlePageChange,
    direction,
    handleSearch,
    searchTerm,
    reset,
  } = useFetchPaginatedKeys(selectedDataType);

  /**Resets internal state of useFetchPaginatedKeys then invalidates query to start from scratch*/
  const handleDataTypeChange = (dataType?: RedisDataTypeUnion) => {
    reset();
    setSelectedDataType(dataType);
    queryClient.invalidateQueries(["useFetchPaginatedKeys"]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-4 space-y-4 overflow-y-auto  min-h-[540px]">
        <div className="px-3 py-2">
          <div className="flex items-center mb-3 space-x-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-500 left-3 " />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 w-[180px] inline-flex items-center justify-center rounded text-[13px] leading-none"
                onChange={(e) => handleSearch(e.target.value)}
                value={searchTerm.replaceAll("*", "")}
              />
            </div>
            <DataTypeSelector
              onDataTypeChange={handleDataTypeChange}
              dataType={selectedDataType}
              key={selectedDataType}
            />
          </div>
          <div className="space-y-1">
            {isLoading || error ? (
              <div className="space-y-1">
                {Array(10)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton className="w-full h-[40px] rounded" key={idx} />
                  ))}
              </div>
            ) : (
              dataKeys?.map(([dataKey, dataType]) => {
                return (
                  <Button
                    variant={selectedDataKey === dataKey ? "default" : "ghost"}
                    className="justify-start w-full"
                    key={dataKey}
                    onClick={() => onDataKeyChange([dataKey, dataType])}
                  >
                    {dataKey}
                    <RedisTypeTag value={dataType} className="ml-auto pointer-events-none" />
                  </Button>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Separator />
      <div className="px-3 py-4">
        <div className="flex items-center gap-2">
          <ReloadButton onDataTypeChange={handleDataTypeChange} />
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 ml-auto disabled:bg-[#8080803d]"
            disabled={direction.prevNotAllowed || isLoading}
            onClick={() => handlePageChange("prev")}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 disabled:bg-[#8080803d]"
            disabled={direction.nextNotAllowed || isLoading}
            onClick={() => handlePageChange("next")}
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

const ReloadButton = ({
  onDataTypeChange,
}: {
  onDataTypeChange: (dataType?: RedisDataTypeUnion) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onDataTypeChange(undefined);
    }, 500);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-8 h-8"
      onClick={handleClick}
      disabled={isLoading}
    >
      <ReloadIcon className={isLoading ? "animate-spin" : ""} />
    </Button>
  );
};
