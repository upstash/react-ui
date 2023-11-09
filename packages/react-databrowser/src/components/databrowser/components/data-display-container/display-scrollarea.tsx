import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import formatHighlight from "@/lib/utils";
import parse from "html-react-parser";
import ReactDOM from "react-dom/server";

export const DisplayScrollarea = ({ data }: { data: string | JSON | null }) => {
  const stringifiable = toJsonStringifiable(data);

  return (
    <ScrollArea className="flex h-[425px] shrink-0 items-center justify-center overflow-x-auto break-all rounded-md p-3">
      {stringifiable ? (
        <>
          <div className="absolute right-4 top-3">
            <CopyToClipboardButton onCopy={() => handleCopyClick(stringifiable)} />
          </div>
          <pre className="whitespace-pre-wrap text-[14px]" style={{ fontFamily: "monospace" }}>
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
