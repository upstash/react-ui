import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RedisDataTypeUnion } from "@/types";
import { useDeleteKey } from "../../hooks/useDeleteKey";
import { DeleteAlertDialog } from "./delete-alert-dialog";

type Props = {
  selectedDataKey: string;
  onDataKeyChange: (dataKey?: [string, RedisDataTypeUnion]) => void;
};

export const DataDelete = ({ onDataKeyChange, selectedDataKey }: Props) => {
  const { toast } = useToast();
  const deleteKey = useDeleteKey();

  const handleDeleteKey = async () => {
    try {
      const result = await deleteKey.mutateAsync(selectedDataKey);
      if (result) {
        onDataKeyChange(undefined);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="ml-auto" data-testid="delete">
      <DeleteAlertDialog onDeleteConfirm={handleDeleteKey}>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border border-[#D9D9D9]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.33325 5.83333H16.6666M4.16659 5.83333L4.99992 15.8333C4.99992 16.2754 5.17551 16.6993 5.48807 17.0118C5.80063 17.3244 6.22456 17.5 6.66659 17.5H13.3333C13.7753 17.5 14.1992 17.3244 14.5118 17.0118C14.8243 16.6993 14.9999 16.2754 14.9999 15.8333L15.8333 5.83333M7.49992 5.83333V3.33333C7.49992 3.11232 7.58772 2.90036 7.744 2.74408C7.90028 2.5878 8.11224 2.5 8.33325 2.5H11.6666C11.8876 2.5 12.0996 2.5878 12.2558 2.74408C12.4121 2.90036 12.4999 3.11232 12.4999 3.33333V5.83333M8.33325 10L11.6666 13.3333M11.6666 10L8.33325 13.3333"
              stroke="black"
              strokeOpacity="0.8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </DeleteAlertDialog>
    </div>
  );
};
