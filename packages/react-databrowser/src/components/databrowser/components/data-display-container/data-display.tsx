import { useFetchSingleDataByKey } from "@/components/databrowser/hooks/useFetchSingleDataByKey";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { Skeleton } from "@/components/ui/skeleton";
import { RedisDataTypeUnion } from "@/types";
import { CopyToClipboardButton, handleCopyClick } from "../../copy-to-clipboard-button";
import { DataDelete } from "./data-delete";
import { DataTable } from "./data-table";
import { DisplayScrollarea } from "./display-scrollarea";
import { MissingDataDisplay } from "./missing-data-display";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DataTTLActions } from "./data-ttl-actions";

type Props = {
  selectedDataKeyTypePair: [string, RedisDataTypeUnion];
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};

export function DataDisplay({ selectedDataKeyTypePair, onDataKeyChange }: Props) {
  const [key, keyType] = selectedDataKeyTypePair;
  const { data, isLoading, navigation, error } = useFetchSingleDataByKey(selectedDataKeyTypePair);
  const isLoadingOrError = isLoading || error;

  return (
    <div className="h-full flex-col pt-2">
      <div className="flex w-full items-center justify-between px-4 ">
        <div className="flex w-full items-center gap-2">
          <p className="max-w-[540px] truncate text-left text-lg font-semibold text-[#000000]">{key}</p>
          <RedisTypeTag isFull value={keyType} className="pointer-events-none" />
          <CopyToClipboardButton variant="ghost" onCopy={() => handleCopyClick(key)} svgSize={{ w: 22, h: 22 }} />
          <div className="ml-auto">
            <DataDelete selectedDataKey={selectedDataKeyTypePair[0]} onDataKeyChange={onDataKeyChange} />
          </div>
        </div>
      </div>
      <div className="mt-[12px] h-[1px] w-full bg-[#0000000D]" />
      {isLoadingOrError ? (
        <Skeleton className="h-[425px] rounded-none shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] " />
      ) : (keyType === "string" && data?.type === "string") || (keyType === "json" && data?.type === "json") ? (
        <DisplayScrollarea data={data.content} />
      ) : keyType === "zset" && data?.type === "zset" ? (
        <DataTable data={data.content} tableHeaders={["SCORE", "MEMBERS"]} />
      ) : keyType === "hash" && data?.type === "hash" ? (
        <DataTable data={data.content} tableHeaders={["FIELDS", "CONTENT"]} />
      ) : keyType === "list" && data?.type === "list" ? (
        <DataTable data={data.content} tableHeaders={["INDEX", "CONTENT"]} />
      ) : keyType === "set" && data?.type === "set" ? (
        <DataTable data={data.content} tableHeaders={[null, "MEMBERS"]} />
      ) : keyType === "stream" && data?.type === "stream" ? (
        <DataTable data={data.content} tableHeaders={["STREAMID", "FIELDS"]} />
      ) : data?.type === "unknown" ? (
        <MissingDataDisplay />
      ) : null}
      <div className="mb-[12px] h-[1px] w-full bg-[#0000000D]" />
      <div className="flex w-full px-4">
        <DataTTLActions selectedDataKey={selectedDataKeyTypePair[0]} />
        <div className="ml-2  flex h-[25px] items-center justify-center  gap-[2px] rounded-md bg-[#00000008] px-2 py-1 text-sm text-[#00000099]">
          Memory: ~{data?.memory} bytes
        </div>
        {keyType !== "json" && keyType !== "string" && (
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="ml-auto h-8 w-8 disabled:bg-[#0000000D]"
              onClick={() => navigation.handlePageChange("prev")}
              disabled={navigation.prevNotAllowed}
              data-testid="datatable-prev"
            >
              <ChevronLeftIcon width="20px" height="20px" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 disabled:bg-[#0000000D]"
              onClick={() => navigation.handlePageChange("next")}
              disabled={navigation.nextNotAllowed}
              data-testid="datatable-next"
            >
              <ChevronRightIcon width="20px" height="20px" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
