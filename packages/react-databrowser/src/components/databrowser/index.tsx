import "@/globals.css";
import { queryClient } from "@/lib/clients";
import { DatabrowserProps, DatabrowserProvider } from "@/store";
import { RedisDataTypeUnion } from "@/types";
import { useState } from "react";
import { QueryClientProvider } from "react-query";
import { Toaster } from "../ui/toaster";
import { DataDisplayContainer } from "./components/data-display-container";
import { Sidebar } from "./components/sidebar";

export const Databrowser = ({ token, url }: DatabrowserProps) => {
  const [selectedDataKey, setSelectedDataKey] = useState<[string, RedisDataTypeUnion] | undefined>();

  const handleDataKeySelect = (dataKey?: [string, RedisDataTypeUnion]) => {
    setSelectedDataKey(dataKey);
  };

  return (
    <DatabrowserProvider databrowser={{ token, url }}>
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
