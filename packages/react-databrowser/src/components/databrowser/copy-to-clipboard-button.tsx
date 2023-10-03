import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyToClipboardButton({ onCopy }: { onCopy: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    onCopy();
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Button size="icon-sm" variant="outline" onClick={handleCopy}>
      {copied ? <CheckIcon /> : <ClipboardCopyIcon />}
    </Button>
  );
}
