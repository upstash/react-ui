import { queryClient } from "@/lib/clients";
import { DatabrowserProps, DatabrowserProvider } from "@/store";
import { RedisDataTypeUnion } from "@/types";
import { useState } from "react";
import { QueryClientProvider } from "react-query";
import { Toaster } from "../ui/toaster";
import { AddDataDialog } from "./components/add-data/add-data-dialog";
import { DataDisplayContainer } from "./components/data-display-container";
import { Sidebar } from "./components/sidebar";
import "@/globals.css";

export const Databrowser = ({ token, url }: DatabrowserProps) => {
  const [selectedDataKey, setSelectedDataKey] = useState<[string, RedisDataTypeUnion] | undefined>();

  const handleDataKeySelect = (dataKey?: [string, RedisDataTypeUnion]) => {
    setSelectedDataKey(dataKey);
  };

  return (
    <DatabrowserProvider databrowser={{ token, url }}>
      <QueryClientProvider client={queryClient}>
        <div className="bg-red flex flex-col gap-4">
          <div className="ml-auto">
            <AddDataDialog onNewDataAdd={handleDataKeySelect} />
          </div>
          <div className="overflow-hidden rounded-[0.5rem] border shadow">
            <div className="grid text-ellipsis lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
              <Sidebar selectedDataKey={selectedDataKey?.[0]} onDataKeyChange={handleDataKeySelect} />
              <DataDisplayContainer selectedDataKeyTypePair={selectedDataKey} onDataKeyChange={handleDataKeySelect} />
              <Toaster />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </DatabrowserProvider>
  );
};
