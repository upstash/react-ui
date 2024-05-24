import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";

type Props = {
  isRawView: boolean;
  rawData: string;
  isContentEditable: boolean;
  onContentChange: (text?: string) => void;
};
export const DisplayScrollarea = ({ rawData, isRawView, isContentEditable, onContentChange }: Props) => {
  const stringifiable = isRawView ? rawData : prettifyData(rawData);

  return (
    <ScrollArea
      className={cn(
        "relative flex h-[425px] shrink-0 items-center justify-center overflow-x-auto break-all p-3",
        isContentEditable && "rounded-none",
      )}
    >
      {stringifiable ? (
        <Editor
          height={400}
          className="editable"
          defaultLanguage="json"
          value={stringifiable}
          onChange={onContentChange}
          options={{
            wordWrap: "on",
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            formatOnPaste: true,
            formatOnType: true,
            readOnlyMessage: { value: "You must enable editing first!" },
            readOnly: !isContentEditable,
            renderWhitespace: "all",
            smoothScrolling: true,
            minimap: { enabled: false },
            autoIndent: "full",
            fontSize: 13,
            cursorBlinking: "smooth",
            parameterHints: { enabled: false },
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 5,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      ) : null}
    </ScrollArea>
  );
};

export const prettifyData = (data: string) => {
  const object = rawToObject(data);

  return toJsonStringifiable(object);
};

const rawToObject = (rawData: string) => {
  try {
    return JSON.parse(JSON.parse(rawData));
  } catch (_error) {
    return rawData;
  }
};

export const toJsonStringifiable = (content: string | JSON | Record<string, unknown> | null): string => {
  try {
    if (typeof content === "object" && content !== null) {
      try {
        return JSON.stringify(sortObject(content, true), null, 2);
      } catch (sortError) {
        console.error("Error sorting object:", sortError);
      }
    }

    return JSON.stringify(content, null, 2) ?? content?.toString() ?? "";
  } catch (error) {
    console.error("Unexpected error stringifying content:", error);
    return "";
  }
};

// Answer found here: https://stackoverflow.com/a/62552623
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const sortObject = (unordered: [] | Record<string, any> | null, sortArrays = false) => {
  if (!unordered || typeof unordered !== "object") {
    return unordered;
  }

  if (Array.isArray(unordered)) {
    const newArr: unknown[] = unordered.map((item) => sortObject(item, sortArrays));
    if (sortArrays) {
      newArr.sort();
    }
    return newArr;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const ordered: Record<string, any> = {};
  Object.keys(unordered)
    .sort()
    .forEach((key) => {
      ordered[key] = sortObject(unordered[key], sortArrays);
    });
  return ordered;
};
