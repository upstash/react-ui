import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { useMutation } from "react-query";

const SUCCESS_MSG = "OK";

export const useAddData = () => {
  const { redis } = useDatabrowser();

  const addData = useMutation(
    async ([dataKey, dataValue, ex, isJSON]: [
      dataKey: string,
      dataValue: string,
      ex: number | null,
      isJSON: boolean,
    ]) => {
      if (isJSON) {
        const res = await redis.json.set(dataKey, "$", dataValue);
        return res === SUCCESS_MSG;
      } else {
        const res = await redis.set(dataKey, dataValue, { ...(ex ? { ex } : { keepTtl: true }) });
        return res === SUCCESS_MSG;
      }
    },
    { onSuccess: () => queryClient.invalidateQueries("useFetchPaginatedKeys") },
  );
  return addData;
};
