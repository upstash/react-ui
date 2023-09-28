import { useState } from "react";
import { DataDisplayContainer } from "./data-display/data-display-container";
import { Sidebar } from "./sidebar";
import { RedisDataTypeUnion } from "@/types";
import { QueryClient, QueryClientProvider } from "react-query";

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
      <div className="overflow-hidden rounded-[0.5rem] border shadow">
        <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
          <Sidebar selectedDataKey={selectedDataKey?.[0]} onDataKeyChange={handleDataKeySelect} />
          <DataDisplayContainer
            selectedDataKeyTypePair={selectedDataKey}
            onDataKeyChange={handleDataKeySelect}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
};
