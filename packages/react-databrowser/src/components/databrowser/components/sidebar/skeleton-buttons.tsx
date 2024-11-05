import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_SKELETON_COUNT = 6

export const LoadingSkeleton = () => (
  <div className="grid">
    {Array.from({ length: DEFAULT_SKELETON_COUNT })
      .fill(0)
      .map((_, idx) => (
        <div className="flex h-10 items-center gap-2 px-3" key={idx}>
          <Skeleton className="size-5 shrink-0 rounded" />
          <Skeleton className="h-4 grow rounded" />
        </div>
      ))}
  </div>
)
