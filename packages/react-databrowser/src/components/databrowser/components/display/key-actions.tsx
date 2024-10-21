import { DataType } from "@/types"
import { IconDotsVertical } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

import { useDeleteKey } from "../../hooks"

export function KeyActions({
  dataKey,
  type,
  content,
}: {
  dataKey: string
  type: DataType
  content?: string
}) {
  const { mutateAsync: deleteKey } = useDeleteKey()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-6 w-6 rounded-md border border-zinc-300 p-0 shadow-sm">
          <IconDotsVertical className="text-zinc-400" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" align="end">
        {content && (
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(content)
              toast({
                description: "Content copied to clipboard",
              })
            }}
          >
            Copy content
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={async () => {
            await deleteKey(dataKey)
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
