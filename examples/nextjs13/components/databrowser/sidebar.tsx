import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DataTypeSelector } from "./data-type-selector";
import { RedisTypeTag } from "./type-tag";
import { useFetchPaginatedKeys } from "./hooks/useFetchPaginatedKeys";
import { useState } from "react";

export function Sidebar({ className }: React.HTMLAttributes<{}>) {
  const { data, isLoading, error } = useFetchPaginatedKeys({});

  return (
    <div className={cn(className, "flex flex-col")}>
      <div className="flex-1 py-4 space-y-4 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="flex items-center mb-3 space-x-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-500 left-3 " />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 w-[180px] inline-flex items-center justify-center rounded text-[13px] leading-none "
              />
            </div>
            <DataTypeSelector />
          </div>
          <div className="space-y-1">
            {data?.map(([dataKey, dataType]) => {
              return (
                <Button variant="ghost" className="justify-start w-full" key={dataKey}>
                  {dataKey}
                  <RedisTypeTag
                    value={dataType}
                    size="short"
                    className="ml-auto pointer-events-none"
                  />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      <Separator />
      <div className="px-3 py-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ReloadIcon />
          </Button>
          <Button variant="outline" size="icon" className="w-8 h-8 ml-auto">
            <ArrowLeftIcon />
          </Button>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
