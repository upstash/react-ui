import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="space-y-1">
    {Array(10)
      .fill(0)
      .map((_, idx) => (
        <Skeleton className="h-[40px] w-full rounded" key={idx} />
      ))}
  </div>
);
