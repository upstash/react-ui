import { useState, type PropsWithChildren } from "react"
import { type ListDataType } from "@/types"
import { ContextMenuSeparator } from "@radix-ui/react-context-menu"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "@/components/ui/use-toast"

import { useEditListItem } from "../hooks"
import { DeleteAlertDialog } from "./display/delete-alert-dialog"

export const ItemContextMenu = ({
  children,
  dataKey,
  itemKey,
  itemValue,
  type,
}: PropsWithChildren<{
  dataKey: string
  type: ListDataType
  itemKey: string
  itemValue?: string
}>) => {
  const { mutate: editItem } = useEditListItem()
  const [isAlertOpen, setAlertOpen] = useState(false)

  return (
    <>
      <DeleteAlertDialog
        open={isAlertOpen}
        onOpenChange={setAlertOpen}
        onDeleteConfirm={(e) => {
          e.stopPropagation()
          editItem({
            type,
            dataKey,
            itemKey,
            // For deletion
            newKey: undefined,
          })
          setAlertOpen(false)
        }}
      />
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              navigator.clipboard.writeText(itemKey)
              toast({
                description: "Key copied to clipboard",
              })
            }}
          >
            Copy key
          </ContextMenuItem>
          {itemValue !== undefined && (
            <ContextMenuItem
              onClick={() => {
                navigator.clipboard.writeText(itemValue)
                toast({
                  description: "Value copied to clipboard",
                })
              }}
            >
              Copy value
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem disabled={type === "stream"} onClick={() => setAlertOpen(true)}>
            Delete item
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
