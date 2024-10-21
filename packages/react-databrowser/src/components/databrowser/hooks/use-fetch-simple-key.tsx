import { useDatabrowser } from "@/store";
import { DataType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const FETCH_SIMPLE_KEY_QUERY_KEY = "fetchSimpleKey";

/** Simple key meaning string or json */
export const useFetchSimpleKey = (dataKey: string, type: DataType) => {
  const { redis } = useDatabrowser();
  return useQuery({
    queryKey: [FETCH_SIMPLE_KEY_QUERY_KEY, dataKey],
    queryFn: async () => {
      if (type === "string") {
        return (await redis.get(dataKey)) as string | null;
      } else if (type === "json") {
        return (await redis.json.get(dataKey)) as string | null;
      } else {
        throw new Error(`Invalid type when fetching simple key: ${type}`);
      }
    },
  });
};
