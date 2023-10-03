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
import { useToast } from "@/components/ui/use-toast";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { FormEvent, useState } from "react";
import { useAddData } from "@/components/databrowser/hooks/useAddData";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { Loader2 } from "lucide-react";
import { RedisDataTypeUnion } from "@/types";

type Props = {
  onNewDataAdd: (dataKey?: [string, RedisDataTypeUnion]) => void;
};
//TODO: Should be extended in the future to accept other data types and expiration types.
export function AddDataDialog({ onNewDataAdd }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const addData = useAddData();

  const handleAddData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const key = formData.get("key") as string;
    const value = formData.get("value") as string;
    const ex = Number(formData.get("ttl"));

    const ok = await addData.mutateAsync([key, value, ex]);

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
              <Label
                htmlFor="value"
                className="h-10 w-full border border-neutral-200 bg-white py-2 ring-offset-white inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px] min-w-[90px]"
              >
                Value
              </Label>
              <Input id="value" name="value" placeholder="Bar" className="col-span-3" />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label
                htmlFor="ttl"
                className="h-10 w-full border border-neutral-200 bg-white py-2 ring-offset-white inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none gap-[5px] min-w-[90px]"
              >
                Expiry(s)
              </Label>
              <Input
                name="ttl"
                type="number"
                id="ttl"
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
