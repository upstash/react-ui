import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DataTypeSelector } from "./databrowser/DataTypeSelector";
import { Input } from "./ui/input";
export function Sidebar({ className }: React.HTMLAttributes<{}>) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-3 space-x-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3 " />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 w-[180px] inline-flex items-center justify-center rounded text-[13px] leading-none"
              />
            </div>
            <DataTypeSelector />
          </div>
          <div className="space-y-1">
            {Array.from({ length: 7 }, (_, index) => index).map((item) => (
              <Button
                variant={item === 0 ? "default" : "ghost"}
                className="justify-start w-full"
                key={item}
              >
                {crypto.randomUUID().slice(0, 6)}:{crypto.randomUUID().slice(0, 6)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
