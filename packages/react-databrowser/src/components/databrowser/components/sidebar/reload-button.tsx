import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export const ReloadButton = ({
  refreshSearch,
  refetchData,
}: {
  refreshSearch: () => void;
  refetchData: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    refreshSearch();
    refetchData();
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
