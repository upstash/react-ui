import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RedisDataTypeUnion } from "@/types";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { useDeleteKey } from "@/components/databrowser/hooks/useDeleteKey";
import { useFetchTTLByKey } from "@/components/databrowser/hooks/useFetchTTLBy";
import { DeleteAlertDialog } from "./delete-alert-dialog";
import { TTLPopover } from "./ttl-popover";

type Props = {
  selectedDataKey: string;
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};
export const DataDisplayHeader = ({ selectedDataKey, onDataKeyChange }: Props) => {
  const deleteKey = useDeleteKey();
  const { data: TTLData, isLoading: isTTLLoading } = useFetchTTLByKey(selectedDataKey);

  const handleDisplayTTL = () => {
    if (TTLData === -1) return "None";
    return `${TTLData?.toString()}s`;
  };

  const handleDeleteKey = async () => {
    const result = await deleteKey.mutateAsync(selectedDataKey);
    if (result) onDataKeyChange(undefined);
  };

  return (
    <div className="flex items-center space-between">
      <TTLPopover TTL={TTLData} dataKey={selectedDataKey}>
        <Button variant="outline" className="space-x-1 text-sm border-dashed">
          <span>TTL:</span>{" "}
          {isTTLLoading ? (
            <Skeleton className="w-[70px] h-[20px] transition-all" />
          ) : (
            <span className="font-bold">{handleDisplayTTL()}</span>
          )}
        </Button>
      </TTLPopover>
      <div className="ml-auto">
        <DeleteAlertDialog onDeleteConfirm={handleDeleteKey}>
          <Button>
            <MinusCircledIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </DeleteAlertDialog>
      </div>
    </div>
  );
};
