import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_SKELETON_COUNT = 10
export const LoadingSkeleton = () => (
  <div className="flex flex-col pr-1">
    {Array(DEFAULT_SKELETON_COUNT)
      .fill(0)
      .map((_, idx) => (
        <div className="flex h-[40px] items-center rounded-md bg-zinc-100 pl-4 pr-8" key={idx}>
          <Skeleton className="mr-2 h-[20px] w-[20px] rounded" />
          <Skeleton className="h-[20px] w-full rounded" />
        </div>
      ))}
  </div>
)
