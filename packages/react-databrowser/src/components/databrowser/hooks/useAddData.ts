import { redis, queryClient } from "@/lib/clients";
import { useMutation } from "react-query";

const SUCCESS_MSG = "OK";

export const useAddData = () => {
  const addData = useMutation(
    async ([dataKey, dataValue, ex]: [dataKey: string, dataValue: string, ex: number | null]) => {
      const res = await redis.set(dataKey, dataValue, { ...(ex ? { ex } : { keepTtl: true }) });
      return res === SUCCESS_MSG;
    },
    { onSuccess: () => queryClient.invalidateQueries("useFetchPaginatedKeys") }
  );
  return addData;
};
