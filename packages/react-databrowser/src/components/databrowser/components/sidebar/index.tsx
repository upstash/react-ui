import { useFetchPaginatedKeys } from "@/components/databrowser/hooks/useFetchPaginatedKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RedisDataTypeUnion } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { AddDataDialog } from "../add-data/add-data-dialog";
import { DataKeyButtons } from "./data-key-buttons";
import { DataTypeSelector } from "./data-type-selector";
import { DisplayDbSize } from "./display-db-size";
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

  const handleDataAdd = (dataKey?: [string, RedisDataTypeUnion]) => {
    onDataKeyChange(dataKey);
    reset();
  };

  //Reset after delete
  useEffect(() => {
    if (!selectedDataKey) {
      reset();
    }
  }, [selectedDataKey]);

  return (
    <div className="flex min-h-[543px] flex-col">
      <div className="flex-1 overflow-y-auto pt-[12px]">
        <div className="px-3">
          <div className="flex items-center gap-2 drop-shadow-sm">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search"
                className="h-[32px] w-[140px] items-center justify-center rounded-none rounded-l-lg border-r-0 border-[#D9D9D9] px-4 text-[14px] placeholder-[#1F1F1F66] focus-visible:ring-0"
                onChange={(e) => handleSearch(e.target.value)}
                value={searchTerm.replaceAll("*", "")}
              />
              <DataTypeSelector
                onDataTypeChange={handleDataTypeChange}
                dataType={selectedDataType}
                key={selectedDataType}
              />
            </div>
            <ReloadButton onDataTypeChange={handleDataTypeChange} />
            <AddDataDialog onNewDataAdd={handleDataAdd} />
          </div>
          <div className="mt-[12px] h-[1px] w-full bg-[#0000000D]" />
          <div className="w-full py-[8px]">
            {error ? (
              <SidebarMissingData />
            ) : isLoading ? (
              <LoadingSkeleton />
            ) : dataKeys?.length ? (
              <DataKeyButtons dataKeys={dataKeys} selectedDataKey={selectedDataKey} onDataKeyChange={onDataKeyChange} />
            ) : (
              <SidebarMissingData />
            )}
          </div>
        </div>
      </div>
      <div className="px-3 pb-4">
        <div className="mb-[12px] h-[1px] w-full bg-[#0000000D]" />
        <div className="flex items-center gap-2">
          <DisplayDbSize />
          <Button
            variant="outline"
            size="icon"
            className="ml-auto h-8 w-8 disabled:bg-[#0000000D]"
            disabled={direction.prevNotAllowed || isLoading}
            onClick={() => handlePageChange("prev")}
            data-testid="sidebar-prev"
          >
            <ChevronLeftIcon width="20px" height="20px" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 disabled:bg-[#0000000D]"
            disabled={direction.nextNotAllowed || isLoading}
            onClick={() => handlePageChange("next")}
            data-testid="sidebar-next"
          >
            <ChevronRightIcon width="20px" height="20px" />
          </Button>
        </div>
      </div>
    </div>
  );
}
