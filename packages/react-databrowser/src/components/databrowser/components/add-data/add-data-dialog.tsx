import { useAddData } from "@/components/databrowser/hooks/useAddData";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { RedisDataTypeUnion } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

const expUnit = [
  "Second(s)",
  "Minute(s)",
  "Hour(s)",
  "Day(s)",
  "Week(s)",
  "Month(s)",
  "Year(s)",
] as const;
export type ExpUnitUnion = (typeof expUnit)[number];

type Props = {
  onNewDataAdd: (dataKey?: [string, RedisDataTypeUnion]) => void;
};
//TODO: Should be extended in the future to accept other data types.
export function AddDataDialog({ onNewDataAdd }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const addData = useAddData();

  const handleAddData = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const key = formData.get("key") as string;
      const value = formData.get("value") as string;
      const exp = Number(formData.get("exp"));
      const expUnit = formData.get("exp-unit") as ExpUnitUnion;
      const ttl = convertToSeconds(expUnit, exp);
      const ok = await addData.mutateAsync([key, value, ttl]);
      if (!key || !value) throw new Error("Missing key or value data");

      if (ok) {
        toast({
          description: "Data Set Successfully!",
        });
        onNewDataAdd([key, "string"]);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 ml-auto border-dashed">
          <PlusCircledIcon className="w-4 h-4 mr-2" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add data</DialogTitle>
          <DialogDescription asChild>
            <div>
              <span>Data will be added as a</span> <RedisTypeTag value="string" isFull />. But, you
              can directly pass a <RedisTypeTag value="json" isFull /> object to the value.
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddData}>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label
                htmlFor="key"
                className="h-10 w-full border border-neutral-200 bg-white py-2 ring-offset-white inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px] min-w-[90px]"
              >
                Key
              </Label>
              <Input id="key" name="key" placeholder="Foo" className="col-span-3" />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <div className="flex h-full">
                <Label
                  htmlFor="value"
                  className="h-10 w-full border border-neutral-200 bg-white py-2 ring-offset-white inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px] min-w-[90px]"
                >
                  Value
                </Label>
              </div>
              <Textarea
                onBlur={(e) => {
                  try {
                    const value = JSON.parse(e.target.value);
                    const prettified = JSON.stringify(value, null, 4);
                    e.target.value = prettified;
                  } catch {}
                }}
                cols={5}
                rows={5}
                id="value"
                name="value"
                placeholder="Bar"
                className="col-span-3 overflow-x-auto"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Select name="exp-unit">
                <SelectTrigger className="h-10 w-full border border-neutral-200 bg-white py-2 ring-offset-white inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px] min-w-[90px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Expiry(s)</SelectLabel>
                    {expUnit.map((dataType) => (
                      <SelectItem value={dataType} key={dataType}>
                        {dataType}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                name="exp"
                type="number"
                id="exp"
                placeholder="1H is 3600 seconds"
                className="col-span-3"
              />
              <p className="col-span-4 text-sm text-gray-500 w-100">
                Leave it empty if you want to make the key permanent.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={addData.isLoading}>
              {addData.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const timeUnitToSeconds: Record<ExpUnitUnion, number> = {
  "Second(s)": 1,
  "Minute(s)": 60,
  "Hour(s)": 3600,
  "Day(s)": 86400,
  "Week(s)": 604800,
  "Month(s)": 2592000, // Note: This is an approximation!
  "Year(s)": 31536000, // Note: This does not account for leap years!
};

function convertToSeconds(expUnit: ExpUnitUnion, exp: number): number {
  if (!(expUnit in timeUnitToSeconds)) {
    throw new Error("Invalid time unit");
  }
  return exp * timeUnitToSeconds[expUnit];
}
