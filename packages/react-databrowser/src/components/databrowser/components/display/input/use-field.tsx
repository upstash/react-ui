import { Dispatch, SetStateAction, useState, useMemo, useEffect, useCallback } from "react";
import { ContentType, ContentTypeSelect } from "./content-type-select";
import { CustomEditor } from "./custom-editor";

export const useField = ({ value, setValue }: { value: string; setValue: Dispatch<SetStateAction<string>> }) => {
  const [initialValue, setInitialValue] = useState(value);
  const [isChanged, setIsChanged] = useState(false);
  const [contentType, setContentType] = useState<ContentType>(() => (checkIsValidJSON(value) ? "JSON" : "Text"));

  const onUpdate = useCallback(() => {
    setInitialValue(value);
    setIsChanged(false);
  }, [value, setInitialValue]);

  // Attempt to format JSON on initial load
  useEffect(() => {
    setValue((old) => (checkIsValidJSON(old) ? formatJSON(old) : old));
  }, [setValue]);

  const handleTypeChange = useCallback(
    (type: ContentType) => {
      setContentType(type);
      setValue(type === "JSON" ? formatJSON(value) : initialValue);
    },
    [value, initialValue, setValue],
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
    selector: <ContentTypeSelect value={contentType} onChange={handleTypeChange} data={value} />,
    editor: (
      <CustomEditor
        language={contentType === "JSON" ? "json" : "plaintext"}
        value={value}
        onChange={handleChange}
        maxDynamicHeight={200}
      />
    ),
    isChanged,
    initialValue,
    onUpdate,
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
