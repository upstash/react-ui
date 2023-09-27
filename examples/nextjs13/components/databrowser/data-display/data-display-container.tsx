import React from "react";
import { DataDisplay } from "./data-display";
import { DataDisplayHeader } from "./data-display-header";
import { useFetchSingleDataByKey } from "../hooks/useFetchSingleDataByKey";
import { useFetchTTLByKey } from "../hooks/useFetchTTLBy";
import { MissingDataDisplay } from "../missing-data-display";

type Props = {
  selectedDataKey?: string;
};
export const DataDisplayContainer = ({ selectedDataKey }: Props) => {
  const {
    data: value,
    // isLoading: string,
    // error: TTLError,
  } = useFetchSingleDataByKey(selectedDataKey);
  if (!selectedDataKey) {
    return <MissingDataDisplay />;
  }

  return (
    <div className="col-span-4 lg:border-l">
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="h-full space-y-6">
          <DataDisplayHeader selectedDataKey={selectedDataKey} />
          <DataDisplay />
        </div>
      </div>
    </div>
  );
};
