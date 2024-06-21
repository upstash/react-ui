import type { RedisDataTypeUnion } from "@/types";
import { DataDisplay } from "./data-display";
import { MissingDataDisplay } from "./missing-data-display";

type Props = {
  selectedDataKeyTypePair?: [string, RedisDataTypeUnion];
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
  dataFetchTimestamp: number;
};

export const DataDisplayContainer = ({ selectedDataKeyTypePair, onDataKeyChange, dataFetchTimestamp }: Props) => {
  if (!selectedDataKeyTypePair) {
    return <MissingDataDisplay />;
  }

  return (
    <div className="col-span-4">
      <div className="h-full py-1 pr-1">
        <div className="h-full space-y-6 rounded-lg bg-white" style={{ boxShadow: "0px 0px 6px 0px #0000001A" }}>
          <DataDisplay
            selectedDataKeyTypePair={selectedDataKeyTypePair}
            key={selectedDataKeyTypePair[0]}
            onDataKeyChange={onDataKeyChange}
            dataFetchTimestamp={dataFetchTimestamp}
          />
        </div>
      </div>
    </div>
  );
};
