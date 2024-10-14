import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberWithCommas } from "@/lib/utils";
import { useDatabrowser } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const DisplayDbSize = () => {
  const { redis } = useDatabrowser();
  const {
    isLoading,
    error,
    data: keyCount,
  } = useQuery({
    queryKey: ["useFetchDbSize"],
    queryFn: async () => {
      return await redis.dbsize();
    },
  });

  if (keyCount === undefined) {
    return (
      <div className="flex items-center justify-center gap-1 text-sm font-normal text-[#00000066]">
        <Skeleton className="h-5 w-10 rounded" />
      </div>
    );
  }
  return <div className="text-sm font-normal text-[#00000066]">{formatNumberWithCommas(keyCount)} Keys</div>;
};
