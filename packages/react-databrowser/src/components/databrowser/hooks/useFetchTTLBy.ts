import { redis } from "@/lib/clients";
import { useQuery } from "react-query";

export const useFetchTTLByKey = (dataKey?: string) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["useFetchTTLByKey", dataKey],
    queryFn: async () => {
      if (!dataKey) throw new Error("Key is missing!");
      const stringValue = await redis.ttl(dataKey);
      return stringValue;
    },
  });
  return { isLoading, error, data };
};
