import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyToClipboardButton, handleCopyClick } from "../../copy-to-clipboard-button";
import { prettifyData } from "./display-scrollarea";
import { IconBraces } from "../icons/icon-braces";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  onContentEditableToggle: () => void;
  isContentEditable: boolean;
  onContentEditableSave: () => Promise<void>;
  data: string | JSON | null;

  isRawView: boolean;
  setRawView: (value: boolean) => void;
  showRawCheckbox?: boolean;
};
export const DataValueEdit = ({
  isContentEditable,
  onContentEditableToggle,
  onContentEditableSave,
  data,
  isRawView,
  setRawView,
  showRawCheckbox,
}: Props) => {
  return (
    <div className="flex gap-2 transition-all">
      {/* Raw view checkbox */}
      {!isContentEditable && showRawCheckbox && (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <Checkbox checked={!isRawView} onChange={(check) => setRawView(!check)}>
                <IconBraces />
              </Checkbox>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRawView ? "Raw view" : "Pretty print"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Save button */}
      {isContentEditable && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-md border border-[#D9D9D9]"
          data-testid="save-items"
          onClick={onContentEditableSave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        </Button>
      )}

      {/* Copy button */}
      {!isContentEditable && (
        <CopyToClipboardButton
          onCopy={() => handleCopyClick(typeof data === "string" ? data : JSON.stringify(data))}
          svgSize={{ w: 20, h: 20 }}
          className="h-8 w-8 rounded-md border border-[#D9D9D9]"
        />
      )}

      {/* Edit button */}
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              onClick={onContentEditableToggle}
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md border border-[#D9D9D9]"
              data-testid="edit-items-in-place"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                <path d="m15 5 3 3" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>You can edit items in-place</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
