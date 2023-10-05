import { Button } from "@/components/ui/button";
import { RedisDataTypeUnion } from "@/types";
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
    <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleClick} disabled={isLoading}>
      <ReloadIcon className={isLoading ? "animate-spin" : ""} />
    </Button>
  );
};
