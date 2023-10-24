import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_FETCH_COUNT } from "../../hooks/useFetchPaginatedKeys";

export const LoadingSkeleton = () => (
  <div className="flex flex-col gap-[1px]">
    {Array(DEFAULT_FETCH_COUNT)
      .fill(0)
      .map((_, idx) => (
        <Skeleton className="h-[40px] w-full rounded" key={idx} />
      ))}
  </div>
);
