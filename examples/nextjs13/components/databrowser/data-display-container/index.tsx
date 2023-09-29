import { RedisDataTypeUnion } from "@/types";
import { MissingDataDisplay } from "./missing-data-display";
import { DataDisplay } from "./data-display";
import { DataDisplayHeader } from "./data-display-header";

type Props = {
  selectedDataKeyTypePair?: [string, RedisDataTypeUnion];
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};

export const DataDisplayContainer = ({ selectedDataKeyTypePair, onDataKeyChange }: Props) => {
  if (!selectedDataKeyTypePair) {
    return <MissingDataDisplay />;
  }

  return (
    <div className="col-span-4 lg:border-l">
      <div className="h-full px-4 py-6 lg:px-8">
        <div className="h-full space-y-6">
          <DataDisplayHeader
            selectedDataKey={selectedDataKeyTypePair[0]}
            onDataKeyChange={onDataKeyChange}
          />
          <DataDisplay selectedDataKeyTypePair={selectedDataKeyTypePair} />
        </div>
      </div>
    </div>
  );
};
