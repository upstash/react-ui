import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onCopy: () => void;
  sizeVariant?: "icon-sm" | "icon-xs";
  variant?: "outline" | "default" | "ghost";
};

export function CopyToClipboardButton({
  onCopy,
  sizeVariant = "icon-sm",
  variant = "outline",
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
    <Button size={sizeVariant} variant={variant} onClick={handleCopy}>
      {copied ? <CheckIcon /> : <ClipboardCopyIcon />}
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
