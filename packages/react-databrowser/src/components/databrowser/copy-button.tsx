import { useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  sizeVariant?: "icon-sm" | "icon-xs"
  svgSize?: { w: number; h: number }
  variant?: "outline" | "default" | "ghost"
  value: string
}

export function CopyButton({
  value,
  sizeVariant = "icon-sm",
  variant = "outline",
  className,
}: Props) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      size={sizeVariant}
      variant={variant}
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
      className={cn("text-zinc-500", className)}
    >
      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
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
