import { Skeleton } from "@/components/ui/skeleton";
import { RedisDataTypeUnion } from "@/types";
import { useFetchSingleDataByKey } from "../hooks/useFetchSingleDataByKey";
import { RedisTypeTag } from "../type-tag";
import { DataTable } from "./data-table";
import { DisplayScrollarea } from "./display-scrollarea";

type Props = {
  selectedDataKeyTypePair: [string, RedisDataTypeUnion];
};

export function DataDisplay({ selectedDataKeyTypePair }: Props) {
  const [key, keyType] = selectedDataKeyTypePair;
  const { data, isLoading, navigation, error } = useFetchSingleDataByKey(selectedDataKeyTypePair);

  return (
    <div className="flex-col h-full p-0 border-none">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">{key}</h2>
            <RedisTypeTag isFull value={keyType} />
          </div>
          <p className="text-base font-medium text-muted-foreground">Content</p>
        </div>
      </div>
      {isLoading || error ? (
        <Skeleton className="transition-all rounded  my-4 p-4 flex h-[400px] shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" />
      ) : (keyType === "string" && data?.type === "string") ||
        (keyType === "json" && data?.type === "json") ? (
        <DisplayScrollarea data={data.content} />
      ) : keyType === "zset" && data?.type === "zset" ? (
        <DataTable
          data={data.content}
          navigation={navigation}
          tableHeaders={["Score", "Content"]}
        />
      ) : keyType === "hash" && data?.type === "hash" ? (
        <DataTable
          data={data.content}
          navigation={navigation}
          tableHeaders={["Field", "Content"]}
        />
      ) : keyType === "list" && data?.type === "list" ? (
        <DataTable
          data={data.content}
          navigation={navigation}
          tableHeaders={["Index", "Content"]}
        />
      ) : keyType === "set" && data?.type === "set" ? (
        <DataTable data={data.content} navigation={navigation} tableHeaders={[null, "Content"]} />
      ) : null}
    </div>
  );
}
