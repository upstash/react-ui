import { useState } from "react";
import { DataDisplayContainer } from "./data-display/data-display-container";
import { Sidebar } from "./sidebar";
import { RedisDataTypeUnion } from "@/types";

export const Databrowser = () => {
  const [selectedDataKey, setSelectedDataKey] = useState<
    [string, RedisDataTypeUnion] | undefined
  >();

  const handleDataKeySelect = (dataKey?: [string, RedisDataTypeUnion]) => {
    setSelectedDataKey(dataKey);
  };

  return (
    <div className="overflow-hidden rounded-[0.5rem] border shadow">
      <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
        <Sidebar selectedDataKey={selectedDataKey?.[0]} onDataKeyChange={handleDataKeySelect} />
        <DataDisplayContainer
          selectedDataKeyTypePair={selectedDataKey}
          onDataKeyChange={handleDataKeySelect}
        />
      </div>
    </div>
  );
};
