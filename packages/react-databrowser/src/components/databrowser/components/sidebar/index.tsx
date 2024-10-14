import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddDataDialog } from "../add-data/add-data-dialog";
import { KeysList } from "./data-key-buttons";
import { DataTypeSelector } from "./data-type-selector";
import { DisplayDbSize } from "./display-db-size";
import { SidebarMissingData } from "./sidebar-missing-data";
import { LoadingSkeleton } from "./skeleton-buttons";
import { useKeys } from "../../hooks/useKeys";
import { IconMaximize } from "@tabler/icons-react";
import { useDatabrowserStore } from "@/store";

export function Sidebar() {
  const { keys, query } = useKeys();
  const { setSearchKey, search } = useDatabrowserStore();

  return (
    <div className="w-[350px]">
      {/* Header */}
      <div className="rounded-lg bg-zinc-100 px-3 py-2">
        {/* Header top */}
        <div className="mb-2 flex justify-between">
          <DisplayDbSize />
          <div className="flex gap-1">
            <Button variant={"outline"} className="h-8 w-8 p-0">
              <IconMaximize size={20} />
            </Button>
            <AddDataDialog />
          </div>
        </div>
        {/* Header bottom */}
        <div className="flex">
          <DataTypeSelector />
          <Input
            type="text"
            placeholder="Search"
            className={
              "block h-8 rounded-l-none border-zinc-300 px-2 font-normal placeholder-zinc-300 focus-visible:ring-0"
            }
            onChange={(e) => setSearchKey(e.target.value)}
            value={search.key}
          />
        </div>
      </div>
      <div>{query.isLoading ? <LoadingSkeleton /> : keys.length > 0 ? <KeysList /> : <SidebarMissingData />}</div>
    </div>
  );
}
