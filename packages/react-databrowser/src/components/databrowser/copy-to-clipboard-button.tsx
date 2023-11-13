import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  onCopy: () => void;
  sizeVariant?: "icon-sm" | "icon-xs";
  svgSize?: { w: number; h: number };
  variant?: "outline" | "default" | "ghost";
}

export function CopyToClipboardButton({
  onCopy,
  sizeVariant = "icon-sm",
  variant = "outline",
  svgSize,
  className,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    onCopy();
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Button size={sizeVariant} variant={variant} onClick={handleCopy} className={className}>
      {copied ? (
        <CheckIcon />
      ) : (
        <svg
          width={svgSize?.w ?? 15}
          height={svgSize?.h ?? 15}
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.3333 7.66683V6.00016C14.3333 5.55814 14.1577 5.13421 13.8451 4.82165C13.5325 4.50909 13.1086 4.3335 12.6666 4.3335H5.99992C5.55789 4.3335 5.13397 4.50909 4.82141 4.82165C4.50885 5.13421 4.33325 5.55814 4.33325 6.00016V12.6668C4.33325 13.1089 4.50885 13.5328 4.82141 13.8453C5.13397 14.1579 5.55789 14.3335 5.99992 14.3335H7.66659M7.66659 9.3335C7.66659 8.89147 7.84218 8.46755 8.15474 8.15499C8.4673 7.84242 8.89122 7.66683 9.33325 7.66683H15.9999C16.4419 7.66683 16.8659 7.84242 17.1784 8.15499C17.491 8.46755 17.6666 8.89147 17.6666 9.3335V16.0002C17.6666 16.4422 17.491 16.8661 17.1784 17.1787C16.8659 17.4912 16.4419 17.6668 15.9999 17.6668H9.33325C8.89122 17.6668 8.4673 17.4912 8.15474 17.1787C7.84218 16.8661 7.66659 16.4422 7.66659 16.0002V9.3335Z"
            strokeOpacity="0.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Button>
  );
}

export const handleCopyClick = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
