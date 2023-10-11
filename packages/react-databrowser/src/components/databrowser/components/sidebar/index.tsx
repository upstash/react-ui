import { useFetchPaginatedKeys } from "@/components/databrowser/hooks/useFetchPaginatedKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RedisDataTypeUnion } from "@/types";
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { DataKeyButtons } from "./data-key-buttons";
import { DataTypeSelector } from "./data-type-selector";
import { ReloadButton } from "./reload-button";
import { SidebarMissingData } from "./sidebar-missing-data";
import { LoadingSkeleton } from "./skeleton-buttons";

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

  const handleDataTypeChange = (dataType?: RedisDataTypeUnion) => {
    reset();
    setSelectedDataType(dataType);
  };

  return (
    <div className="flex flex-col">
      <div className="min-h-[670px] flex-1 space-y-4 overflow-y-auto  py-4">
        <div className="px-3 py-2">
          <div className="mb-3 flex items-center space-x-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute bottom-0 left-3 top-0 my-auto h-5 w-5 text-gray-500 " />
              <Input
                type="text"
                placeholder="Search"
                className="inline-flex w-[180px] items-center justify-center rounded pl-10 text-[13px] leading-none"
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
              <LoadingSkeleton />
            ) : dataKeys?.length ? (
              <DataKeyButtons dataKeys={dataKeys} selectedDataKey={selectedDataKey} onDataKeyChange={onDataKeyChange} />
            ) : (
              <SidebarMissingData />
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
            className="ml-auto h-8 w-8 disabled:bg-[#8080803d]"
            disabled={direction.prevNotAllowed || isLoading}
            onClick={() => handlePageChange("prev")}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 disabled:bg-[#8080803d]"
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
