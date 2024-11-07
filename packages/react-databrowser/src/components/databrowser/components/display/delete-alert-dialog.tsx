import type { MouseEventHandler } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteAlertDialog({
  children,
  onDeleteConfirm,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode
  onDeleteConfirm: MouseEventHandler
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Irreversible Action!</AlertDialogTitle>
          <AlertDialogDescription className="mt-5">
            <span className="font-bold">This action CANNOT BE UNDONE.</span>
            <br />
            <br />
            By proceeding, you will <span className="font-bold">PERMANENTLY REMOVE</span> your data
            from our servers, resulting in complete and irreversible loss of your information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-gray-50 hover:bg-red-600"
            onClick={onDeleteConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
