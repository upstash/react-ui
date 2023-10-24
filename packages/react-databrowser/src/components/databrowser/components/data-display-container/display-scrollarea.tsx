import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import parse from "html-react-parser";
import formatHighlight from "@/lib/utils";

export const DisplayScrollarea = ({ data }: { data: string | JSON | null }) => {
  const stringifiable = toJsonStringifiable(data);
  console.log({ data });

  return (
    <ScrollArea className="flex h-[420px] shrink-0 items-center justify-center overflow-x-auto rounded-md p-3 ">
      {stringifiable ? (
        <>
          <div className="absolute right-4 top-3">
            <CopyToClipboardButton onCopy={() => handleCopyClick(stringifiable)} />
          </div>
          <pre className="text-[14px]">{parse(formatHighlight(data))}</pre>
        </>
      ) : null}
    </ScrollArea>
  );
};

const toJsonStringifiable = (content: string | JSON | null) => {
  try {
    if (typeof content === "string") {
      return content;
    }
    if (typeof content === "object") {
      return JSON.stringify(content, null, 2);
    }
  } catch {
    return JSON.stringify(content, null, 2);
  }
};
