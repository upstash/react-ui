import type { DatabrowserProps } from "@/store";
import { Redis } from "@upstash/redis";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export const redisClient = (databrowser?: DatabrowserProps) => {
  const token = databrowser?.token || process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
  const url = databrowser?.url || process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;

  if (!url) {
    throw new Error("Redis URL is missing!");
  }
  if (!token) {
    throw new Error("Redis TOKEN is missing!");
  }

  const redis = new Redis({
    url,
    token,
    enableAutoPipelining: true,
    automaticDeserialization: false,
  });

  return redis;
};

/**
 * QueryClient Configuration.
 *
 * @summary
 * This configuration is mainly set to refetch data when the window gains focus and to keep the data from becoming stale for 2 minutes. However, there is a potential edge case where if a user, without changing focus, adds data from CLI and comes back, they might see the stale data for up to 2 minutes.
 *
 * @example
 * To reproduce the edge case:
 * 1. Divide your screen into two parts.
 * 2. Add data from the CLI on one side.
 * 3. Observe the application on the other side.
 *
 * This scenario can cause the data to be stale since switching to and from the CLI should ideally remount the component and hence the entire QueryProvider too, triggering a refetch.
 *
 * @todo
 * 1. Monitor if this edge case is encountered by users.
 * 2. If reported, consider increasing the staleTime to 3-4 minutes and refetching time to 1.5-2 minutes.
 * 3. Reassess whether retries are needed in this configuration, as the SDK already has retry mechanisms.
 *
 * @defaultOptions
 * - staleTime: 120000 ms (2 minutes) (Potential adjustment to 3-4 minutes if edge case reported.)
 * - refetchOnWindowFocus: true (Kept true to ensure data is not stale when user switches back to this window.)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.name === "UpstashError") {
        let desc = error.message;

        // Because the message does not fit in the toast, we only take the
        // first two sentences.
        // Example: "ERR max daily request limit exceeded. Limit: 10000, Usage: 10000."
        if (error.message.includes("max daily request limit exceeded.")) {
          desc = error.message.split(".").slice(0, 2).join(".");
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: desc,
        });
      }
      console.error(error);
    },
  }),
});
