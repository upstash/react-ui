import { redis, queryClient } from "@/lib/clients";
import { useMutation } from "react-query";

export const useUpdateTTL = () => {
  const updateTTL = useMutation(
    async ({ dataKey, newTTLValue }: { dataKey: string; newTTLValue: number }) => {
      return Boolean(await redis.expire(dataKey, newTTLValue));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("useFetchSingleDataByKey");
        queryClient.invalidateQueries("useFetchTTLByKey");
      },
    }
  );
  return updateTTL;
};

export const usePersistTTL = () => {
  const persistTTL = useMutation(
    async (dataKey: string) => {
      return Boolean(await redis.persist(dataKey));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("useFetchSingleDataByKey");
        queryClient.invalidateQueries("useFetchTTLByKey");
      },
    }
  );
  return persistTTL;
};
