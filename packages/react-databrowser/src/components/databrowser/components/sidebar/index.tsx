import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddDataDialog } from "../add-data/add-data-dialog";
import { KeysList } from "./keys-list";
import { DataTypeSelector } from "./type-selector";
import { DisplayDbSize } from "./db-size";
import { Empty } from "./empty";
import { LoadingSkeleton } from "./skeleton-buttons";
import { useKeys } from "../../hooks/use-keys";
import { IconLoader2, IconMaximize } from "@tabler/icons-react";
import { useDatabrowserStore } from "@/store";

export function Sidebar() {
  const { keys, query } = useKeys();
  const { setSearchKey, search } = useDatabrowserStore();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight > scrollHeight - 100) {
      if (query.isFetching || !query.hasNextPage) return;
      query.fetchNextPage();
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border p-1">
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
      {query.isLoading ? (
        <LoadingSkeleton />
      ) : keys.length > 0 ? (
        <div className="h-full w-full overflow-y-scroll" onScroll={handleScroll}>
          <KeysList />
          <div className="flex h-[100px] justify-center py-2 text-zinc-300">
            {query.isFetching && <IconLoader2 className="animate-spin" size={16} />}
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
}
