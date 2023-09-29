import { RedisDataTypeUnion } from "@/types";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "../ui/toaster";
import { DataDisplayContainer } from "./components/data-display-container";
import { Sidebar } from "./components/sidebar";
import { AddDataDialog } from "./components/add-data/add-data-dialog";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
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
