import { DataType } from "@/types";
import { RedisTypeTag } from "../../type-tag";
import { formatBytes } from "@/lib/utils";
import { TTLPopover } from "./old/ttl-popover";
import { useFetchTTLByKey } from "../../hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { IconChevronDown } from "@tabler/icons-react";

export const DisplayHeader = ({
  size,
  length,
  dataKey,
  type,
  hideBadges,
}: {
  size?: number;
  length?: number;
  dataKey: string;
  type: DataType;
  hideBadges?: boolean;
}) => {
  return (
    <div className="rounded-lg bg-zinc-100 px-3 py-2">
      <h2 className="my-2 mb-4">
        {dataKey.trim() === "" ? (
          <>
            <span className="font-mono">{`"${dataKey}"`}</span>
            <span className="ml-3 text-sm text-zinc-500">(empty key)</span>
          </>
        ) : (
          dataKey
        )}
      </h2>
      {!hideBadges && (
        <div className="flex flex-wrap gap-1">
          <RedisTypeTag type={type} isIcon={false} />
          {size && <Badge label="Size:">{formatBytes(size)}</Badge>}
          {length && <Badge label="Size:">{size}</Badge>}
          <TTLBadge dataKey={dataKey} />
        </div>
      )}
    </div>
  );
};

const TTLBadge = ({ dataKey }: { dataKey: string }) => {
  const { data: ttl, isLoading } = useFetchTTLByKey(dataKey);

  return (
    <Badge label="TTL:">
      {isLoading ? (
        <Skeleton className="ml-1 h-3 w-[60px] rounded-md opacity-50" />
      ) : (
        <>
          <TTLPopover dataKey={dataKey} TTL={ttl}>
            <div className="flex gap-[2px]">
              {ttl === -1 ? "Forever" : `${ttl}s`}
              <IconChevronDown className="mt-[1px] text-zinc-400" size={16} />
            </div>
          </TTLPopover>
        </>
      )}
    </Badge>
  );
};

const Badge = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="flex h-6 items-center rounded-md bg-white px-2 text-xs text-zinc-700">
    <span className="mr-[3px] text-zinc-500">{label}</span>
    {children}
  </div>
);
