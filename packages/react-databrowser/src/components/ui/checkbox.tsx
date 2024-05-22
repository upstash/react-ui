import { cn } from "@/lib/utils";
import React, { type PropsWithChildren } from "react";
import { Button } from "./button";

type Props = PropsWithChildren<{
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}>;

export const Checkbox = React.forwardRef<HTMLButtonElement, Props>(
  ({ checked, onChange, className, children }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-md border border-[#D9D9D9]",
          checked ? "border-emerald-400 !text-emerald-400" : "bg-white text-black",
          className,
        )}
        onClick={() => onChange?.(!checked)}
      >
        {children}
      </Button>
    );
  },
);
