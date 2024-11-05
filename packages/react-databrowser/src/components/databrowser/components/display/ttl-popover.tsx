import { useEffect, useMemo, useState, type PropsWithChildren } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
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

      <PopoverContent className="w-[300px]" align="end">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h4 className="font-medium leading-none">Expiration</h4>

          <div>
            <div className="flex items-center">
              <Controller
                rules={{
                  required: "Please enter an expiration time",
                  min: { value: -1, message: "TTL can't be lower than -1" },
                }}
                control={control}
                name="value"
                render={({ field }) => (
                  <Input min="-1" {...field} className="grow rounded-r-none" />
                )}
              />

              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-auto rounded-l-none border-l-0 pr-8">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {timeUnits.map((unit) => (
                        <SelectItem key={unit.label} value={unit.label}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {formState.errors.value && (
              <p className="mt-2 text-xs text-red-500">{formState.errors.value.message}</p>
            )}

            <p className="mt-2 text-xs text-zinc-500">
              TTL sets a timer to automatically delete keys after a defined period.
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={ttl === PERSISTED_KEY}
              onClick={handlePersist}
            >
              Persist
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
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
