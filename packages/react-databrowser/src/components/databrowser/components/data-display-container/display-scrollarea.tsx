import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";

type Props = {
  data: string | JSON | null;
  isContentEditable: boolean;
  onContentChange: (text?: string) => void;
};
export const DisplayScrollarea = ({ data, isContentEditable, onContentChange }: Props) => {
  const stringifiable = toJsonStringifiable(data);

  return (
    <ScrollArea
      className={cn(
        "flex h-[425px] shrink-0 items-center justify-center overflow-x-auto break-all p-3",
        isContentEditable && "rounded-none",
      )}
    >
      {stringifiable ? (
        <>
          {!isContentEditable && (
            <div className="absolute right-3 top-3">
              <CopyToClipboardButton onCopy={() => handleCopyClick(stringifiable)} svgSize={{ w: 22, h: 22 }} />
            </div>
          )}

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
        </>
      ) : null}
    </ScrollArea>
  );
};

const toJsonStringifiable = (content: string | JSON | null): string => {
  try {
    if (typeof content === "string") {
      return content;
    }
    if (typeof content === "object") {
      return JSON.stringify(sortObject(content, true), null, 2);
    }
  } catch (error) {
    console.error("Error stringifying content:", error);
  }

  return "";
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
