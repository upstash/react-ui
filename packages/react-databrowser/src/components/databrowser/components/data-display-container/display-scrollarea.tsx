import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import formatHighlight, { cn } from "@/lib/utils";
import parse from "html-react-parser";
import ReactDOM from "react-dom/server";

type Props = {
  data: string | JSON | null;
  isContentEditable: boolean;
  onContentChange: (text: string) => void;
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

          <pre
            id="editable"
            suppressContentEditableWarning={true}
            contentEditable={isContentEditable}
            className={cn(
              "whitespace-pre-wrap text-[14px]",
              isContentEditable && "border-[0.5px] border-dashed border-[#00000063] p-1 transition-all",
            )}
            style={{ fontFamily: "monospace" }}
            onBlur={(e) => e.currentTarget.textContent && onContentChange(e.currentTarget.textContent)}
          >
            {tryParse(data)}
          </pre>
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
      return JSON.stringify(content, null, 2);
    }
  } catch (error) {
    console.error("Error stringifying content:", error);
  }

  return "";
};

const tryParse = (data: string | JSON | null) => {
  try {
    const parseableHTML = ReactDOM.renderToStaticMarkup(parse(data as string) as JSX.Element);
    return parseableHTML;
  } catch {
    if (typeof data === "string") {
      return data;
    }
    if (data) {
      return parse(formatHighlight(sortObject(data, true)));
    }
    return null;
  }
};

// Answer found here: https://stackoverflow.com/a/62552623
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const sortObject = (unordered: [] | Record<string, any>, sortArrays = false) => {
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
