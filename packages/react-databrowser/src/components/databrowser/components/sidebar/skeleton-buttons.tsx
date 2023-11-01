import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_SKELETON_COUNT = 10;
export const LoadingSkeleton = () => (
  <div className="flex flex-col gap-[1px]">
    {Array(DEFAULT_SKELETON_COUNT)
      .fill(0)
      .map((_, idx) => (
        <Skeleton className="h-[40px] w-full rounded" key={idx} />
      ))}
  </div>
);
