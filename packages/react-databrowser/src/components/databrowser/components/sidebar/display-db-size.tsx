import { Skeleton } from "@/components/ui/skeleton";
import { useDatabrowser } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const DisplayDbSize = () => {
  const { redis } = useDatabrowser();
  const { isLoading, error, data } = useQuery({
    queryKey: ["useFetchDbSize"],
    queryFn: async () => {
      return await redis.dbsize();
    },
  });

  if (isLoading || error) {
    return (
      <div className="flex items-center justify-center gap-1 text-sm font-normal text-[#00000066]">
        Total: <Skeleton className="h-5 w-10 rounded" />
      </div>
    );
  }
  return <div className="text-sm font-normal text-[#00000066]">Total: {data}</div>;
};
