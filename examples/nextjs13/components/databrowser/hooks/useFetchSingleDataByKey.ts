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
  });
  return { isLoading, error, data };
};
