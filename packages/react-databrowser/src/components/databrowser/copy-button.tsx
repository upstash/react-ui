import { useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button"

interface Props extends ButtonProps {
  svgSize?: { w: number; h: number }
  value: string
}

export function CopyButton({ value, ...props }: Props) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      onClick={(e) => {
        setCopied(true)
        handleCopyClick(value)
        setTimeout(() => {
          setCopied(false)
        }, 1500)
        navigator.clipboard.writeText(value)
        e.stopPropagation()
        e.preventDefault()
      }}
      className={cn("", props.className)}
      variant="secondary"
      size="icon-sm"
      {...props}
    >
      {copied ? (
        <IconCheck className="size-4 text-green-500" />
      ) : (
        <IconCopy className="size-4 text-zinc-500" />
      )}
    </Button>
  )
}

export const handleCopyClick = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy)
  } catch (error) {
    console.error("Failed to copy text:", error)
  }
}
