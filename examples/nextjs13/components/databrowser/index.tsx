import { RedisDataTypeUnion } from "@/types";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "../ui/toaster";
import { DataDisplayContainer } from "./components/data-display-container";
import { Sidebar } from "./components/sidebar";
import { AddDataDialog } from "./components/add-data/add-data-dialog";

/**
 * QueryClient Configuration.
 *
 * @summary
 * This configuration is mainly set to refetch data when the window gains focus and to keep the data from becoming stale for 2 minutes. However, there is a potential edge case where if a user, without changing focus, adds data from CLI and comes back, they might see the stale data for up to 2 minutes.
 *
 * @example
 * To reproduce the edge case:
 * 1. Divide your screen into two parts.
 * 2. Add data from the CLI on one side.
 * 3. Observe the application on the other side.
 *
 * This scenario can cause the data to be stale since switching to and from the CLI should ideally remount the component and hence the entire QueryProvider too, triggering a refetch.
 *
 * @todo
 * 1. Monitor if this edge case is encountered by users.
 * 2. If reported, consider increasing the staleTime to 3-4 minutes and refetching time to 1.5-2 minutes.
 * 3. Reassess whether retries are needed in this configuration, as the SDK already has retry mechanisms.
 *
 * @defaultOptions
 * - staleTime: 120000 ms (2 minutes) (Potential adjustment to 3-4 minutes if edge case reported.)
 * - refetchOnWindowFocus: true (Kept true to ensure data is not stale when user switches back to this window.)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 2,
      refetchOnWindowFocus: true,
    },
  },
});

export const Databrowser = () => {
  const [selectedDataKey, setSelectedDataKey] = useState<
    [string, RedisDataTypeUnion] | undefined
  >();

  const handleDataKeySelect = (dataKey?: [string, RedisDataTypeUnion]) => {
    setSelectedDataKey(dataKey);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-4">
        <div className="ml-auto">
          <AddDataDialog onNewDataAdd={handleDataKeySelect} />
        </div>
        <div className="overflow-hidden rounded-[0.5rem] border shadow">
          <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
            <Sidebar selectedDataKey={selectedDataKey?.[0]} onDataKeyChange={handleDataKeySelect} />
            <DataDisplayContainer
              selectedDataKeyTypePair={selectedDataKey}
              onDataKeyChange={handleDataKeySelect}
            />
            <Toaster />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};
