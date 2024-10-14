import { queryClient } from "@/lib/clients";
import type { DataType } from "@/types";
import { useState } from "react";
import { useAddData } from "./useAddData";

export const useUpdateStringAndJSON = ([key, keyType]: [string, DataType], TTLData: number | undefined) => {
  const { mutateAsync: replaceData, status: updateDataStatus } = useAddData();

  const [isContentEditable, setIsContentEditable] = useState(false);
  const [updatedContent, setUpdatedContent] = useState<string>();

  const handleUpdatedContent = (text?: string) => {
    setUpdatedContent(text);
  };
  const handleContentEditableToggle = () => {
    setIsContentEditable((prevState) => !prevState);
  };

  const handleContentUpdate = async () => {
    const isDataTypeJSON = keyType === "json";
    const isPersistedTTL = TTLData === -1;
    if (!updatedContent) {
      return;
    }

    await replaceData([key, updatedContent, isPersistedTTL || !TTLData ? null : TTLData, isDataTypeJSON]);
    queryClient.invalidateQueries({
      queryKey: ["useFetchSingleDataByKey"],
    });
    queryClient.invalidateQueries({
      queryKey: ["useFetchTTLByKey"],
    });
    setIsContentEditable(false);
    setUpdatedContent(undefined);
  };

  return {
    handleContentUpdate,
    updateDataStatus,
    handleContentEditableToggle,
    handleUpdatedContent,
    isContentEditable,
  };
};
