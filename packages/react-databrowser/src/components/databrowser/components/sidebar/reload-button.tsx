import { useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"

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
        size="icon"
        className="h-8 w-8 rounded-md border border-[#D9D9D9]"
        onClick={handleClick}
        disabled={isLoading || isLoadingProp}
      >
        <ReloadIcon
          className={isLoading || isLoadingProp ? "animate-spin" : ""}
        />
      </Button>
    </div>
  )
}
