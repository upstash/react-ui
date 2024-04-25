import "@/globals.css";
import { queryClient } from "@/lib/clients";
import { type DatabrowserProps, DatabrowserProvider } from "@/store";
import type { RedisDataTypeUnion } from "@/types";
import { useMemo, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../ui/toaster";
import { DataDisplayContainer } from "./components/data-display-container";
import { Sidebar } from "./components/sidebar";

export const Databrowser = ({ token, url }: DatabrowserProps) => {
  const [selectedDataKey, setSelectedDataKey] = useState<[string, RedisDataTypeUnion] | undefined>();

  const handleDataKeySelect = (dataKey?: [string, RedisDataTypeUnion]) => {
    setSelectedDataKey(dataKey);
  };

  const databrowserCredentials = useMemo(() => ({ token, url }), [token, url]);

  return (
    <DatabrowserProvider databrowser={databrowserCredentials}>
      <QueryClientProvider client={queryClient}>
        <div className="overflow-hidden rounded-xl bg-[#F5F5F5]">
          <div className="grid text-ellipsis lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
            <Sidebar selectedDataKey={selectedDataKey?.[0]} onDataKeyChange={handleDataKeySelect} />
            <DataDisplayContainer selectedDataKeyTypePair={selectedDataKey} onDataKeyChange={handleDataKeySelect} />
            <Toaster />
          </div>
        </div>
      </QueryClientProvider>
    </DatabrowserProvider>
  );
};
