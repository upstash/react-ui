import { useFetchSingleDataByKey } from "@/components/databrowser/hooks/useFetchSingleDataByKey";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { Skeleton } from "@/components/ui/skeleton";
import { RedisDataTypeUnion } from "@/types";
import { CopyToClipboardButton, handleCopyClick } from "../../copy-to-clipboard-button";
import { DataDelete } from "./data-delete";
import { DataTable } from "./data-table";
import { DisplayScrollarea } from "./display-scrollarea";
import { MissingDataDisplay } from "./missing-data-display";

type Props = {
  selectedDataKeyTypePair: [string, RedisDataTypeUnion];
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};

export function DataDisplay({ selectedDataKeyTypePair, onDataKeyChange }: Props) {
  const [key, keyType] = selectedDataKeyTypePair;
  const { data, isLoading, navigation, error } = useFetchSingleDataByKey(selectedDataKeyTypePair);

  return (
    <div className="h-full flex-col ">
      <div className="flex w-full items-center justify-between px-[16px]">
        <div className="flex w-full items-center gap-3">
          <h2 className="line-clamp-1 text-lg font-semibold tracking-tight">{key} </h2>
          <RedisTypeTag isFull value={keyType} />
          <CopyToClipboardButton variant="ghost" onCopy={() => handleCopyClick(key)} svgSize={{ w: 20, h: 20 }} />
          <div className="ml-auto">
            <DataDelete selectedDataKey={selectedDataKeyTypePair[0]} onDataKeyChange={onDataKeyChange} />
          </div>
        </div>
      </div>
      <div className="mt-[8px] h-[1px] w-full bg-[#0000000D]" />
      {isLoading || error ? (
        <Skeleton className="flex h-[525px] rounded p-4 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] transition-all" />
      ) : (keyType === "string" && data?.type === "string") || (keyType === "json" && data?.type === "json") ? (
        <DisplayScrollarea data={data.content} />
      ) : keyType === "zset" && data?.type === "zset" ? (
        <DataTable data={data.content} navigation={navigation} tableHeaders={["Score", "Members"]} />
      ) : keyType === "hash" && data?.type === "hash" ? (
        <DataTable data={data.content} navigation={navigation} tableHeaders={["Field", "Fields"]} />
      ) : keyType === "list" && data?.type === "list" ? (
        <DataTable data={data.content} navigation={navigation} tableHeaders={["INDEX", "CONTENT"]} />
      ) : keyType === "set" && data?.type === "set" ? (
        <DataTable data={data.content} navigation={navigation} tableHeaders={[null, "Members"]} />
      ) : keyType === "stream" && data?.type === "stream" ? (
        <DataTable data={data.content} navigation={navigation} tableHeaders={["StreamID", "Fields"]} />
      ) : data?.type === "unknown" ? (
        <MissingDataDisplay />
      ) : null}
    </div>
  );
}
