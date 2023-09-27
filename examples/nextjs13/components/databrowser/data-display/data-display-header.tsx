import { Button } from "@/components/ui/button";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { TTLDialog } from "../ttl-dialog";
import { DeleteAlertDialog } from "../delete-alert-dialog";
import { useFetchTTLByKey } from "../hooks/useFetchTTLBy";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  selectedDataKey?: string;
};
export const DataDisplayHeader = ({ selectedDataKey }: Props) => {
  const { data: TTLData, isLoading: isTTLLoading } = useFetchTTLByKey(selectedDataKey);

  const handleDisplayTTL = () => {
    if (TTLData === -1) return "None";
    return `${TTLData?.toString()}s`;
  };

  return (
    <div className="flex items-center space-between">
      <TTLDialog>
        <Button variant="outline" className="space-x-1 text-sm border-dashed">
          <span>TTL:</span>{" "}
          {isTTLLoading ? (
            <Skeleton className="w-[70px] h-[20px] transition-all" />
          ) : (
            <span className="font-bold">{handleDisplayTTL()}</span>
          )}
        </Button>
      </TTLDialog>
      <div className="ml-auto">
        <DeleteAlertDialog>
          <Button>
            <MinusCircledIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </DeleteAlertDialog>
      </div>
    </div>
  );
};
