import { Dispatch, SetStateAction, useState, useMemo, useEffect, useCallback } from "react";
import { ContentType, ContentTypeSelector } from "./content-type-select";
import { CustomEditor } from "./custom-editor";

export const useField = ({ value, setValue }: { value: string; setValue: Dispatch<SetStateAction<string>> }) => {
  const [isChanged, setIsChanged] = useState(false);
  const resetIsChanged = useCallback(() => setIsChanged(false), [setIsChanged]);

  const [contentType, setContentType] = useState<ContentType>(() => (checkIsValidJSON(value) ? "JSON" : "Text"));

  // Attempt to format JSON on initial load
  useEffect(() => {
    setValue((old) => (checkIsValidJSON(old) ? formatJSON(old) : old));
  }, [setValue]);

  const handleTypeChange = useCallback(
    (type: ContentType) => {
      if (type === "JSON" && !checkIsValidJSON(value))
        throw new Error("Invalid JSON when attempting to change type to JSON");
      setContentType(type);
      setValue(type === "JSON" ? formatJSON(value) : value);
    },
    [value, setValue],
  );

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      setIsChanged(true);
    },
    [setValue],
  );

  const isValidJSON = useMemo(() => checkIsValidJSON(value), [value]);

  return {
    selector: <ContentTypeSelector value={contentType} onChange={handleTypeChange} />,
    editor: (
      <CustomEditor
        language={contentType === "JSON" ? "json" : "plaintext"}
        value={value}
        onChange={handleChange}
        maxDynamicHeight={200}
      />
    ),
    isChanged,
    resetIsChanged,
    /** Is valid for submitting */
    isValid: contentType === "JSON" ? isValidJSON : true,
  };
};

const formatJSON = (value: string) => JSON.stringify(JSON.parse(value), null, 2);

export const checkIsValidJSON = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};
