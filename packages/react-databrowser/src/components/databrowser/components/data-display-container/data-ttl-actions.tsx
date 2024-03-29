import { Skeleton } from "@/components/ui/skeleton";
import { TTLPopover } from "./ttl-popover";

type Props = {
  selectedDataKey: string;
  TTLData?: number;
  isTTLLoading: boolean;
};

export const DataTTLActions = ({ selectedDataKey, TTLData, isTTLLoading }: Props) => {
  const handleDisplayTTL = () => {
    if (TTLData === -1) {
      return "Forever";
    }
    return TTLData ? `${TTLData.toString()}s` : "Missing";
  };

  return (
    <TTLPopover TTL={TTLData} dataKey={selectedDataKey}>
      <div className="ttl-with-gray-bg">
        <span>TTL:</span>{" "}
        {isTTLLoading ? <Skeleton className="h-[20px] transition-all" /> : <span>{handleDisplayTTL()}</span>}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 6L8 10L12 6"
            stroke="black"
            strokeOpacity="0.6"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </TTLPopover>
  );
};
