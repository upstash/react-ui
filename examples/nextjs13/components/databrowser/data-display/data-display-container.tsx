import React from "react";
import { DataDisplay } from "./data-display";
import { DataDisplayHeader } from "./data-display-header";
import { useFetchSingleDataByKey } from "../hooks/useFetchSingleDataByKey";
import { useFetchTTLByKey } from "../hooks/useFetchTTLBy";
import { MissingDataDisplay } from "../missing-data-display";
import { RedisDataTypeUnion } from "@/types";

type Props = {
  selectedDataKeyTypePair?: [string, RedisDataTypeUnion];
};
export const DataDisplayContainer = ({ selectedDataKeyTypePair }: Props) => {
  if (!selectedDataKeyTypePair) {
    return <MissingDataDisplay />;
  }

  return (
    <div className="col-span-4 lg:border-l">
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="h-full space-y-6">
          <DataDisplayHeader selectedDataKey={selectedDataKeyTypePair[0]} />
          <DataDisplay selectedDataKeyTypePair={selectedDataKeyTypePair} />
        </div>
      </div>
    </div>
  );
};
