import { useDatabrowserStore } from "@/store";
import { DataType } from "@/types";
import { RedisTypeTag } from "../../type-tag";
import { formatBytes } from "@/lib/utils";
import { Select } from "@/components/ui/select";

export const DisplayHeader = ({
  size,
  length,
  key,
  type,
}: {
  size?: number;
  length?: number;
  key: string;
  type: DataType;
}) => {
  return (
    <div className="rounded-lg bg-zinc-100 px-3 py-2">
      <h2>{key}</h2>
      <div className="flex flex-wrap gap-1">
        <RedisTypeTag type={type} isIcon={false} />
        {size && <Badge label="Size:">{formatBytes(size)}</Badge>}
        {length && <Badge label="Size:">{size}</Badge>}
        <Badge label="TTL:">
        
        </Badge>
      </div>
    </div>
  );
};

const TTLSelect = ({key}: {
  key: string
}) => {
  return <Select />
}

const Badge = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="flex items-center rounded-md bg-white px-2">
    <span>{label}</span>
    {children}
  </div>
);
