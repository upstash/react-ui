import { useDatabrowser } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useFetchTTL = (dataKey: string) => {
  const { redis } = useDatabrowser();

  const { isLoading, error, data } = useQuery({
    queryKey: ["useFetchTTLByKey", dataKey],
    queryFn: async () => {
      const stringValue = await redis.ttl(dataKey);
      return stringValue;
    },
  });
  return { isLoading, error, data };
};
