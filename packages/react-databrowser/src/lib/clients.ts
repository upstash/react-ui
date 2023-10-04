import { Redis } from "@upstash/redis";
import { QueryClient } from "react-query";

const initializeRedis = () => {
  if (!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL) throw new Error("NEXT_PUBLIC_UPSTASH_REDIS_REST_URL is missing");
  if (!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN)
    throw new Error("NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN is missing");

  const redis = new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
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
      staleTime: 60 * 1000 * 2,
      refetchOnWindowFocus: true,
    },
  },
});

export const redis = initializeRedis();
