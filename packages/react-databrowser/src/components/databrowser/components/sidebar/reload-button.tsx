import { Button } from "@/components/ui/button";
import type { RedisDataTypeUnion } from "@/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export const ReloadButton = ({ onDataTypeChange }: { onDataTypeChange: (dataType?: RedisDataTypeUnion) => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    onDataTypeChange(undefined);
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-md border border-[#D9D9D9]"
        onClick={handleClick}
        disabled={isLoading}
        data-testid="reset"
      >
        <ReloadIcon className={isLoading ? "animate-spin" : ""} />
      </Button>
    </div>
  );
};
