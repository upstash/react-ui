import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CopyToClipboardButton,
  handleCopyClick,
} from "@/components/databrowser/copy-to-clipboard-button";

export const DisplayScrollarea = ({ data }: { data: string | null }) => {
  const stringifiable = toJsonStringifiable(data);

  return (
    <ScrollArea className="my-4 p-4 flex h-[400px] shrink-0 items-center justify-center rounded-md  bg-slate-950 overflow-x-auto">
      {stringifiable ? (
        <>
          <div className="absolute top-3 right-4">
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

const toJsonStringifiable = (content: string | null) => {
  try {
    return JSON.stringify(content, null, 2);
  } catch (error) {
    return content;
  }
};
