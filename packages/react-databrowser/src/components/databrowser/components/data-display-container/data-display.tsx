import { useFetchSingleDataByKey, useFetchTTLByKey, useUpdateStringAndJSON } from "@/components/databrowser/hooks";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RedisDataTypeUnion } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { CopyToClipboardButton, handleCopyClick } from "../../copy-to-clipboard-button";
import { DataDelete } from "./data-delete";
import { DataTable } from "./data-table";
import { DataTTLActions } from "./data-ttl-actions";
import { DataValueEdit } from "./data-value-edit";
import { DisplayScrollarea } from "./display-scrollarea";
import { MissingDataDisplay } from "./missing-data-display";

type Props = {
  selectedDataKeyTypePair: [string, RedisDataTypeUnion];
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};

export function DataDisplay({ selectedDataKeyTypePair, onDataKeyChange }: Props) {
  const [key, keyType] = selectedDataKeyTypePair;
  const { data, isLoading, navigation, error } = useFetchSingleDataByKey(selectedDataKeyTypePair);

  const { data: TTLData, isLoading: isTTLLoading } = useFetchTTLByKey(key);
  const {
    handleContentEditableToggle,
    handleContentUpdate,
    handleUpdatedContent,
    isContentEditable,
    updateDataStatus,
  } = useUpdateStringAndJSON(selectedDataKeyTypePair, TTLData);

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
      {isLoading || updateDataStatus === "loading" ? (
        <div
          className="flex h-[425px] items-center justify-center rounded-none shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] "
          aria-label="Loading..."
          role="status"
        >
          <svg className="h-12 w-12 animate-spin fill-[#13B981]" viewBox="3 3 18 18">
            <path
              className="opacity-20"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            />
            <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z" />
          </svg>
        </div>
      ) : (keyType === "string" && data?.type === "string") || (keyType === "json" && data?.type === "json") ? (
        <DisplayScrollarea
          data={data.content}
          isContentEditable={isContentEditable}
          onContentChange={handleUpdatedContent}
        />
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
      ) : data?.type === "unknown" || error ? (
        <MissingDataDisplay />
      ) : null}
      <div className="mb-[12px] h-[1px] w-full bg-[#0000000D]" />
      <div className="flex w-full items-center px-4">
        <DataTTLActions selectedDataKey={selectedDataKeyTypePair[0]} isTTLLoading={isTTLLoading} TTLData={TTLData} />
        <div className="ml-2 flex h-[25px] items-center justify-center  gap-[2px] rounded-md bg-[#00000008] px-2 py-1 text-sm text-[#00000099]">
          Memory: ~{data?.memory} bytes
        </div>
        {(keyType === "string" || keyType === "json") && (
          <div className="ml-auto">
            <DataValueEdit
              onContentEditableToggle={handleContentEditableToggle}
              onContentEditableSave={() => handleContentUpdate()}
              isContentEditable={isContentEditable}
            />
          </div>
        )}

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
