import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";

export const DisplayScrollarea = ({ data }: { data: string | JSON | null }) => {
  const stringifiable = toJsonStringifiable(data);

  return (
    <ScrollArea className="my-4 flex h-[400px] shrink-0 items-center justify-center overflow-x-auto rounded-md  bg-slate-950 p-4">
      {stringifiable ? (
        <>
          <div className="absolute right-4 top-3">
            <CopyToClipboardButton onCopy={() => handleCopyClick(stringifiable)} />
          </div>
          <pre className="text-[12px] tracking-wider">
            <code className="text-white">{stringifiable}</code>
          </pre>
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
