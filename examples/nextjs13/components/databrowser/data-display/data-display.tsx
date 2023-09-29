import { Skeleton } from "@/components/ui/skeleton";
import { RedisDataTypeUnion } from "@/types";
import { ScrollArea } from "../../ui/scroll-area";
import {
  ContentValue,
  Navigation,
  useFetchSingleDataByKey,
} from "../hooks/useFetchSingleDataByKey";
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
        <ScrollArea className="my-4 p-4 flex h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed bg-slate-100/80 overflow-x-auto">
          <pre className="text-[12px] text-green-600">{JSON.stringify(data.content, null, 2)}</pre>
        </ScrollArea>
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
