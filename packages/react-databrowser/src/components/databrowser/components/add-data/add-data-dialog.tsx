import { useAddData } from "@/components/databrowser/hooks/useAddData";
import { RedisTypeTag } from "@/components/databrowser/components/type-tag";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useDatabrowserStore } from "@/store";
import type { DataType } from "@/types";
import { PlusIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { type FormEvent, useState } from "react";

const expUnit = ["Second(s)", "Minute(s)", "Hour(s)", "Day(s)", "Week(s)", "Month(s)", "Year(s)"] as const;
export type ExpUnitUnion = (typeof expUnit)[number];

export function AddDataDialog() {
  const { toast } = useToast();
  const { setSelectedKey } = useDatabrowserStore();
  const [open, setOpen] = useState(false);

  const addData = useAddData();

  const handleAddData = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const key = formData.get("key") as string;
      const value = formData.get("value") as string;

      if (!(key && value)) {
        throw new Error("Missing key or value data");
      }

      const exp = Number(formData.get("exp"));
      const expUnit = formData.get("exp-unit") as ExpUnitUnion | undefined;
      const ttl = expUnit ? convertToSeconds(expUnit, exp) : null;
      const ok = await addData.mutateAsync([key, value, ttl, false]);

      if (ok) {
        toast({
          description: "Data Set Successfully!",
        });
        setSelectedKey(key);
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
          <DialogTitle>Insert</DialogTitle>
          <DialogDescription asChild>
            <div>
              <span>Data will be added as a</span> <RedisTypeTag type="string" />.
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddData}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="key"
                className="inline-flex h-10 w-full min-w-[90px] items-center justify-center gap-[5px] rounded border border-neutral-200 bg-white px-[15px] py-2 text-[13px] leading-none ring-offset-white"
              >
                Key
              </Label>
              <Input id="key" name="key" placeholder="Foo" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="flex h-full">
                <Label
                  htmlFor="value"
                  className="inline-flex h-10 w-full min-w-[90px] items-center justify-center gap-[5px] rounded border border-neutral-200 bg-white px-[15px] py-2 text-[13px] leading-none ring-offset-white"
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Select name="exp-unit">
                <SelectTrigger className="inline-flex h-10 w-full min-w-[90px] items-center justify-center gap-[5px] rounded border border-neutral-200 bg-white px-[15px] py-2 text-[13px] leading-none ring-offset-white">
                  <SelectValue placeholder="Expires" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Expires</SelectLabel>
                    {expUnit.map((dataType) => (
                      <SelectItem value={dataType} key={dataType}>
                        {dataType}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input name="exp" type="number" id="exp" placeholder="1H is 3600 seconds" className="col-span-3" />
              <p className="w-100 col-span-4 text-sm text-gray-500">
                Leave it empty if you want to make the key permanent.
              </p>
            </div>
          </div>
          <DialogFooter>
            <button disabled={addData.isPending} className="save-changes-btn">
              <Spinner isLoading={addData.isPending} isLoadingText="Please wait">
                Save changes
              </Spinner>
            </button>
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
