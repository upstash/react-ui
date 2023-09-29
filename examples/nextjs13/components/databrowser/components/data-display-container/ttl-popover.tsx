import { PropsWithChildren, useState } from "react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { useToast } from "../../../ui/use-toast";
import { usePersistTTL, useUpdateTTL } from "../../hooks/useUpdateTTL";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { Label } from "../../../ui/label";

// We show None when expiration we recieve from server is -1
const PERSISTED_KEY = -1;

export function TTLPopover({
  children,
  TTL,
  dataKey,
}: PropsWithChildren<{ TTL?: number; dataKey: string }>) {
  const { toast } = useToast();

  const [newTTL, setNewTTL] = useState<number>();
  const updateTTL = useUpdateTTL();
  const persistTTL = usePersistTTL();

  const handleTTLChange = (newTTLValue: number) => setNewTTL(newTTLValue);
  const handleUpdateTTL = async (isClosed: boolean, newTTLValue?: number) => {
    if (isClosed && newTTLValue && newTTLValue !== TTL) {
      const ok = await updateTTL.mutateAsync({ dataKey, newTTLValue });
      if (ok) {
        toast({
          title: "Time Limit Set: Your Key is Now Temporary",
          description: "The expiration time for your key has been successfully updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }

      setNewTTL(undefined);
    }
  };
  const handlePersistTTL = async () => {
    const ok = await persistTTL.mutateAsync(dataKey);
    if (ok) {
      toast({
        title: "Persist Success: Key Now Permanent",
        description: "Confirmed! Your key has been set to remain indefinitely.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Your key might be already persisted.",
      });
    }

    setNewTTL(PERSISTED_KEY);
  };
  return (
    <Popover onOpenChange={(isOpen) => handleUpdateTTL(!isOpen, newTTL)}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Expiration</h4>
            <p className="text-sm text-muted-foreground">Set the expiration for the key.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid items-center grid-cols-3 gap-4">
              <Label htmlFor="ttl">Seconds</Label>
              <Input
                type="number"
                id="ttl"
                defaultValue={TTL}
                className="h-8 col-span-2"
                onChange={({ currentTarget }) => {
                  handleTTLChange(currentTarget.valueAsNumber);
                }}
              />
            </div>
            <div className="rounded-md bg-[#f4f4f5] font-medium text-sm p-2 gap-3 flex flex-col">
              <span>
                Clicking this button will prevent your data from being automatically deleted after a
                certain period.
              </span>
              <Button size="sm" onClick={handlePersistTTL}>
                Persist Key
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
