import { useState } from "react"
import { useDatabrowserStore } from "@/store"
import { DATA_TYPES, type DataType } from "@/types"
import { PlusIcon } from "@radix-ui/react-icons"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/use-toast"
import { TypeTag } from "@/components/databrowser/components/type-tag"
import { useAddKey } from "@/components/databrowser/hooks/use-add-key"

export function AddKeyModal() {
  const { setSelectedKey } = useDatabrowserStore()
  const [open, setOpen] = useState(false)

  const { mutateAsync: addKey, isPending } = useAddKey()
  const { control, handleSubmit, formState, reset } = useForm<{
    key: string
    type: DataType
  }>({
    defaultValues: {
      key: "",
      type: "string",
    },
  })

  const onSubmit = handleSubmit(async ({ key, type }) => {
    try {
      await addKey({ key, type })
      setSelectedKey(key)
      setOpen(false)
      setTimeout(() => {
        window.document.querySelector(`[data-key="${key}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        })
      }, 100)
    } catch (error) {
      toast({
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) reset()
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="primary" size="icon-sm">
          <PlusIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create new key</DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={onSubmit}>
          <div className="flex gap-1">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 w-auto pl-[3px] pr-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DATA_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <TypeTag variant={type} type="badge" />
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              rules={{
                required: "Please enter a key",
              }}
              control={control}
              name="key"
              render={({ field }) => <Input placeholder="mykey" {...field} className="h-8 grow" />}
            />
          </div>

          {formState.errors.key && (
            <p className="mb-3 mt-2 text-xs text-red-500">{formState.errors.key?.message}</p>
          )}

          <p className="mt-2 text-xs text-zinc-500">
            After creating the key, you can edit the value
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <Spinner isLoading={isPending} isLoadingText={"Creating"}>
                Create
              </Spinner>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
