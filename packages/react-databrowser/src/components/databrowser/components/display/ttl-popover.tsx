import { useState, type PropsWithChildren } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"
import { usePersistTTL, useUpdateTTL } from "@/components/databrowser/hooks/use-update-ttl"

// We show None when expiration we recieve from server is -1
const PERSISTED_KEY = -1

export function TTLPopover({
  children,
  TTL,
  dataKey,
}: PropsWithChildren<{ TTL?: number; dataKey: string }>) {
  const { toast } = useToast()
  const [newTTL, setNewTTL] = useState<number>()

  const updateTTL = useUpdateTTL()
  const persistTTL = usePersistTTL()

  const handleTTLChange = (newTTLValue: number) => setNewTTL(newTTLValue)
  const handleUpdateTTL = async (isClosed: boolean, newTTLValue?: number) => {
    try {
      if (isClosed && newTTLValue && newTTLValue !== TTL) {
        const ok = await updateTTL.mutateAsync({ dataKey, newTTLValue })
        if (ok) {
          toast({
            title: "Time Limit Set: Your Key is Now Temporary",
            description: "The expiration time for your key has been successfully updated.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          })
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      })
    } finally {
      setNewTTL(undefined)
    }
  }

  const handlePersistTTL = async () => {
    try {
      const ok = await persistTTL.mutateAsync(dataKey)
      if (ok) {
        toast({
          title: "Persist Success: Key Now Permanent",
          description: "Confirmed! Your key has been set to remain indefinitely.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Your key might be already persisted.",
        })
      }
      setNewTTL(PERSISTED_KEY)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      })
    }
  }
  return (
    <Popover onOpenChange={(isOpen) => handleUpdateTTL(!isOpen, newTTL)}>
      <PopoverTrigger asChild>
        <button>{children}</button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Expiration</h4>
            <p className="text-muted-foreground text-sm">Set the expiration for the key.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="ttl">Seconds</Label>
              <Input
                type="number"
                id="ttl"
                defaultValue={TTL}
                className="col-span-2 h-8"
                onChange={({ currentTarget }) => {
                  handleTTLChange(currentTarget.valueAsNumber)
                }}
              />
            </div>
            {TTL !== PERSISTED_KEY ? (
              <div className="flex flex-col gap-3 rounded-md bg-[#f4f4f5] p-2 text-sm font-medium">
                <span>
                  Clicking this button will prevent your data from being automatically deleted after
                  a certain period.
                </span>

                <Button size="sm" onClick={handlePersistTTL}>
                  <Spinner isLoading={persistTTL.isPending} isLoadingText="Please wait">
                    Persist Key
                  </Spinner>
                </Button>
              </div>
            ) : (
              <p className="text-sm ">
                TTL sets a timer to automatically <span className="font-bold">delete keys</span>{" "}
                after a defined period.
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
