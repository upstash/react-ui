import { useFetchSingleDataByKey, useFetchTTLByKey, useUpdateStringAndJSON } from "@/components/databrowser/hooks";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { Button } from "@/components/ui/button";
import type { DataType } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { CopyToClipboardButton, handleCopyClick } from "../../copy-to-clipboard-button";
import { DataDelete } from "./data-delete";
import { DataTable } from "./data-table";
import { DataTTLActions } from "./data-ttl-actions";
import { DataValueEdit } from "./data-value-edit";
import { DisplayScrollarea } from "./display-scrollarea";
import { MissingDataDisplay } from "./missing-data-display";
import { DataLoading } from "./data-loading";
import { useState } from "react";

export function DataDisplay() {
  const [key, keyType] = selectedDataKeyTypePair;
  const { data, isLoading, navigation, error } = useFetchSingleDataByKey(selectedDataKeyTypePair, dataFetchTimestamp);

  const { data: TTLData, isLoading: isTTLLoading } = useFetchTTLByKey(key);
  const {
    handleContentEditableToggle,
    handleContentUpdate,
    handleUpdatedContent,
    isContentEditable,
    updateDataStatus,
  } = useUpdateStringAndJSON(selectedDataKeyTypePair, TTLData);

  const [isRawView, setRawView] = useState(false);

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
      {isLoading || updateDataStatus === "pending" ? (
        <DataLoading />
      ) : keyType === "string" && data?.type === "string" ? (
        <DisplayScrollarea
          isRawView={isRawView}
          rawData={data.content ?? ""}
          isContentEditable={isContentEditable}
          onContentChange={handleUpdatedContent}
        />
      ) : keyType === "json" && data?.type === "json" ? (
        <DisplayScrollarea
          isRawView={false}
          rawData={data.content ?? ""}
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
      <div className="flex h-8 w-full items-center px-4 ">
        <DataTTLActions selectedDataKey={selectedDataKeyTypePair[0]} isTTLLoading={isTTLLoading} TTLData={TTLData} />
        <div className="ml-2 flex h-[25px] items-center justify-center  gap-[2px] rounded-md bg-[#00000008] px-2 py-1 text-sm text-[#00000099]">
          Memory: ~{data?.memory} bytes
        </div>
        {((keyType === "string" && data?.type === "string") || (keyType === "json" && data?.type === "json")) && (
          <div className="ml-auto">
            <DataValueEdit
              isRawView={isRawView}
              setRawView={setRawView}
              showRawCheckbox={keyType === "string"}
              data={data?.content}
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
