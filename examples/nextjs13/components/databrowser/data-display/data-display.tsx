import { Skeleton } from "@/components/ui/skeleton";
import { RedisDataTypeUnion } from "@/types";
import { ScrollArea } from "../../ui/scroll-area";
import { useFetchSingleDataByKey } from "../hooks/useFetchSingleDataByKey";
import { RedisTypeTag } from "../type-tag";
import { DataTable } from "../data-table";

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
            <h2 className="text-2xl font-semibold tracking-tight">{key}</h2>
            <RedisTypeTag isFull value={keyType}>
              String
            </RedisTypeTag>
          </div>
          <p className="text-lg font-medium text-muted-foreground">Content</p>
        </div>
      </div>
      {isLoading || error ? (
        <Skeleton className="transition-all rounded  my-4 p-4 flex h-[350px] shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" />
      ) : keyType === "string" && data?.type === "string" ? (
        <ScrollArea className="my-4 p-4 flex h-[350px] shrink-0 items-center justify-center rounded-md border border-dashed">
          {data.content}
        </ScrollArea>
      ) : keyType === "zset" && data?.type === "zset" ? (
        <DataTable
          data={data.content}
          navigation={navigation}
          tableHeaders={["Score", "Content"]}
        />
      ) : null}
    </div>
  );
}
