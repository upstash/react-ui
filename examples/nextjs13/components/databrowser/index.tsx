import { useState } from "react";
import { DataDisplayContainer } from "./data-display/data-display-container";
import { Sidebar } from "./sidebar";

export const Databrowser = () => {
  const [selectedDataKey, setSelectedDataKey] = useState<string | undefined>();

  const handleDataKeySelect = (dataKey: string) => {
    setSelectedDataKey(dataKey);
  };

  return (
    <div className="overflow-hidden rounded-[0.5rem] border shadow">
      <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
        <Sidebar selectedDataKey={selectedDataKey} onDataKeyChange={handleDataKeySelect} />
        <DataDisplayContainer />
      </div>
    </div>
  );
};
