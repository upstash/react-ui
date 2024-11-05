import { useEffect, useMemo, useState, type PropsWithChildren } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useSetTTL } from "@/components/databrowser/hooks/use-set-ttl"

const PERSISTED_KEY = -1

const timeUnits = [
  { label: "Seconds", value: 1 },
  { label: "Minutes", value: 60 },
  { label: "Hours", value: 60 * 60 },
  { label: "Days", value: 60 * 60 * 24 },
] as const

export function TTLPopover({
  children,
  ttl,
  dataKey,
}: PropsWithChildren<{ ttl: number; dataKey: string }>) {
  const [open, setOpen] = useState(false)
  const { mutateAsync: setTTL, isPending } = useSetTTL()

  const defaultValues = useMemo(() => {
    return { type: "Seconds", value: ttl } as const
  }, [ttl])

  const { control, handleSubmit, formState, reset } = useForm<{
    type: (typeof timeUnits)[number]["label"]
    value: number
  }>({
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues, {
      keepValues: true,
    })
  }, [defaultValues])

  const onSubmit = handleSubmit(async ({ value, type }) => {
    await setTTL({
      dataKey: dataKey,
      ttl: value * timeUnits.find((unit) => unit.label === type)!.value,
    })
    setOpen(false)
  })

  const handlePersist = async () => {
    await setTTL({
      dataKey: dataKey,
      ttl: undefined,
    })
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) reset()
        setOpen(isOpen)
      }}
    >
      <PopoverTrigger asChild>
        <button>{children}</button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h4 className="font-medium leading-none">Expiration</h4>
          <div>
            <div className="flex">
              <Controller
                rules={{
                  required: "Please enter an expiration time",
                  min: { value: -1, message: "TTL can't be lower than -1" },
                }}
                control={control}
                name="value"
                render={({ field }) => (
                  <Input min="-1" {...field} className="h-8 grow rounded-r-none" />
                )}
              />
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 rounded-l-none border-l-0 pl-2 pr-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {timeUnits.map((unit) => (
                          <SelectItem key={unit.label} value={unit.label}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {formState.errors.value && (
              <div className="my-1 text-xs text-red-500">{formState.errors.value.message}</div>
            )}
          </div>
          <div className="text-xs text-zinc-500">
            TTL sets a timer to automatically delete keys after a defined period.
          </div>
          <div className="flex justify-between">
            <Button
              disabled={ttl === PERSISTED_KEY}
              size={"sm"}
              variant={"outline"}
              onClick={handlePersist}
              type="button"
            >
              Persist
            </Button>
            <div className="flex gap-2">
              <Button size={"sm"} variant={"outline"} onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button size={"sm"} variant={"primary"} type="submit">
                <Spinner isLoading={isPending} isLoadingText="Saving">
                  Save
                </Spinner>
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
