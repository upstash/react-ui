import { useQuery } from "react-query";
import { redis } from "../lib/client";

export const useFetchSingleDataByKey = (dataKey?: string) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["useFetchSingleDataByKey", dataKey],
    queryFn: async () => {
      if (!dataKey) throw new Error("Key is missing!");
      const stringValue = redis.get<string>(dataKey);
      return stringValue;
    },
    retry: 1,
    staleTime: 3500,
    refetchInterval: 3500,
  });
  return { isLoading, error, data };
};
