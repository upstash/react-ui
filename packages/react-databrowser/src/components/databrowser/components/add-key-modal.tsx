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
import { RedisTypeTag } from "@/components/databrowser/components/type-tag"
import { useAddKey } from "@/components/databrowser/hooks/use-add-key"

const expUnit = [
  "Second(s)",
  "Minute(s)",
  "Hour(s)",
  "Day(s)",
  "Week(s)",
  "Month(s)",
  "Year(s)",
] as const
export type ExpUnitUnion = (typeof expUnit)[number]

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
      setOpen(false)
      setSelectedKey(key)
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
        <div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-none bg-[#13B981] hover:bg-[#13B981]/90"
            data-testid="add-new-data"
          >
            <PlusIcon className="h-4 w-4 text-white" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
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
                  <SelectTrigger className="h-8 w-auto pl-[3px] pr-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DATA_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <RedisTypeTag type={type as DataType} />
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
              render={({ field }) => (
                <Input placeholder="mykey" {...field} className="h-8 flex-grow " />
              )}
            />
          </div>
          {formState.errors.key && (
            <div className="mb-3 mt-1 text-xs text-red-500">{formState.errors.key?.message}</div>
          )}
          <div className="mt-1 text-xs text-zinc-500">
            After creating the key, you can edit the value
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => {
                setOpen(false)
              }}
              variant={"outline"}
              className="font-normal"
            >
              Cancel
            </Button>
            <Button variant={"primary"} type="submit">
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

const timeUnitToSeconds: Record<ExpUnitUnion, number> = {
  "Second(s)": 1,
  "Minute(s)": 60,
  "Hour(s)": 3600,
  "Day(s)": 86400,
  "Week(s)": 604800,
  "Month(s)": 2592000, // Note: This is an approximation!
  "Year(s)": 31536000, // Note: This does not account for leap years!
}

function convertToSeconds(expUnit: ExpUnitUnion, exp: number): number {
  if (!(expUnit in timeUnitToSeconds)) {
    throw new Error("Invalid time unit")
  }
  return exp * timeUnitToSeconds[expUnit]
}
