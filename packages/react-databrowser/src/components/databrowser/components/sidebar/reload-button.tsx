import { useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const ReloadButton = ({
  onClick,
  isLoading: isLoadingProp,
}: {
  onClick: () => void
  isLoading?: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    onClick()
    setTimeout(() => {
      setIsLoading(false)
    }, 350)
  }

  return (
    <div>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleClick}
        disabled={isLoading || isLoadingProp}
      >
        <ReloadIcon className={cn("size-4", isLoading || isLoadingProp ? "animate-spin" : "")} />
      </Button>
    </div>
  )
}
