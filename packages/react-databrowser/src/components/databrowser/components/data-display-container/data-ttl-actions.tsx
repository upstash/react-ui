import { Skeleton } from "@/components/ui/skeleton";
import { useFetchTTLByKey } from "../../hooks/useFetchTTLBy";
import { TTLPopover } from "./ttl-popover";

type Props = {
  selectedDataKey: string;
};

export const DataTTLActions = ({ selectedDataKey }: Props) => {
  const { data: TTLData, isLoading: isTTLLoading } = useFetchTTLByKey(selectedDataKey);

  const handleDisplayTTL = () => {
    if (TTLData === -1) {
      return "Forever";
    }
    return TTLData ? `${TTLData.toString()}s` : "Missing";
  };

  return (
    <TTLPopover TTL={TTLData} dataKey={selectedDataKey}>
      <div className="flex h-[25px] w-[120px] items-center justify-center gap-[2px] rounded-md bg-[#00000008] px-2 py-1 text-sm text-[#00000099]">
        <span>TTL:</span>{" "}
        {isTTLLoading ? <Skeleton className="h-[20px] transition-all" /> : <span>{handleDisplayTTL()}</span>}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 6L8 10L12 6"
            stroke="black"
            stroke-opacity="0.6"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </TTLPopover>
  );
};
