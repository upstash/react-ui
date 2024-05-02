import { useFetchPaginatedKeys } from "@/components/databrowser/hooks/useFetchPaginatedKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RedisDataTypeUnion } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
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

const useRefreshOnDelete = ({ dataKey, refresh }: { dataKey?: string; refresh: () => void }) => {
  const firstTime = useRef(true);

  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
      return;
    }

    if (dataKey === undefined) {
      refresh();
    }
  }, [refresh, dataKey]);
};

export function Sidebar({ onDataKeyChange, selectedDataKey }: Props) {
  const [onInputFocus, setOnInputFocus] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState<RedisDataTypeUnion>();
  const {
    data: dataKeys,
    isLoading,
    error,
    handlePageChange,
    direction,
    handleSearch,
    refreshSearch,
    searchInputRef,
  } = useFetchPaginatedKeys(selectedDataType);

  const handleDataTypeChange = (dataType?: RedisDataTypeUnion) => {
    setSelectedDataType(dataType);
  };

  const handleDataAdd = (dataKey?: [string, RedisDataTypeUnion]) => {
    onDataKeyChange(dataKey);
    refreshSearch();
  };

  useRefreshOnDelete({ dataKey: selectedDataKey, refresh: refreshSearch });

  return (
    <div className="flex min-h-[543px] flex-col">
      <div className="flex-1 overflow-y-auto pt-[12px]">
        <div className="overflow-x-hidden px-3">
          <div className="flex w-[320px] items-center gap-2 drop-shadow-sm">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search"
                onFocus={() => setOnInputFocus(true)}
                onBlur={() => setOnInputFocus(false)}
                className={cn(
                  "h-[32px] w-[140px] items-center justify-center border-[#D9D9D9] px-4 text-[14px] placeholder-[#1F1F1F66] transition-[width] duration-300 ease-in-out focus-visible:ring-0 ",
                  onInputFocus && "rounded- w-[320px] focus-visible:ring-0",
                )}
                onChange={(e) => handleSearch(e.target.value)}
                ref={searchInputRef}
                style={{
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  borderTopRightRadius: onInputFocus ? "8px" : 0,
                  borderBottomRightRadius: onInputFocus ? "8px" : 0,
                }}
              />
              <div className={cn("flex gap-2", onInputFocus ? "hidden" : "flex")}>
                <DataTypeSelector
                  onDataTypeChange={handleDataTypeChange}
                  dataType={selectedDataType}
                  key={selectedDataType}
                />
                <ReloadButton refreshSearch={refreshSearch} />
                <AddDataDialog onNewDataAdd={handleDataAdd} />
              </div>
            </div>
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
      <div className="select-none px-3 pb-4">
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
