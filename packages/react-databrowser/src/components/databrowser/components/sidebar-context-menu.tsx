import { useState, type PropsWithChildren } from "react"
import { ContextMenuSeparator } from "@radix-ui/react-context-menu"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "@/components/ui/use-toast"

import { useDeleteKey } from "../hooks"
import { DeleteAlertDialog } from "./display/delete-alert-dialog"

export const SidebarContextMenu = ({
  children,
  dataKey,
}: PropsWithChildren<{
  dataKey: string
}>) => {
  const { mutate: deleteKey } = useDeleteKey()
  const [isAlertOpen, setAlertOpen] = useState(false)

  return (
    <>
      <DeleteAlertDialog
        open={isAlertOpen}
        onOpenChange={setAlertOpen}
        onDeleteConfirm={(e) => {
          e.stopPropagation()
          deleteKey(dataKey)
          setAlertOpen(false)
        }}
      />
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              navigator.clipboard.writeText(dataKey)
              toast({
                description: "Key copied to clipboard",
              })
            }}
          >
            Copy key
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setAlertOpen(true)}>Delete key</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
