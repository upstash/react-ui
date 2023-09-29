import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyToClipboardButton } from "../../copy-to-clipboard-button";

export const DisplayScrollarea = ({ data }: { data: string | null }) => {
  const stringifiable = toJsonStringifiable(data);

  return (
    <ScrollArea className="my-4 p-4 flex h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed bg-slate-100/80 overflow-x-auto">
      {stringifiable ? (
        <>
          <div className="absolute top-3 right-4">
            <CopyToClipboardButton onCopy={() => handleCopyClick(stringifiable)} />
          </div>
          <pre className="text-[12px] text-blue-950 tracking-wider">{stringifiable}</pre>
        </>
      ) : null}
    </ScrollArea>
  );
};

const handleCopyClick = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

const toJsonStringifiable = (content: string | null) => {
  try {
    return JSON.stringify(content, null, 2);
  } catch (error) {
    return content;
  }
};
