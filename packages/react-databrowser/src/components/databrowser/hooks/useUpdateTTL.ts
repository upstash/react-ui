import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { useMutation } from "react-query";

export const useUpdateTTL = () => {
  const { redis } = useDatabrowser();

  const updateTTL = useMutation(
    async ({ dataKey, newTTLValue }: { dataKey?: string; newTTLValue: number }) => {
      if (dataKey === undefined) {
        throw new Error("Key is missing!");
      }
      return Boolean(await redis.expire(dataKey, newTTLValue));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("useFetchSingleDataByKey");
        queryClient.invalidateQueries("useFetchTTLByKey");
      },
    },
  );
  return updateTTL;
};

export const usePersistTTL = () => {
  const { redis } = useDatabrowser();

  const persistTTL = useMutation(
    async (dataKey?: string) => {
      if (dataKey === undefined) {
        throw new Error("Key is missing!");
      }
      return Boolean(await redis.persist(dataKey));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("useFetchSingleDataByKey");
        queryClient.invalidateQueries("useFetchTTLByKey");
      },
    },
  );
  return persistTTL;
};
