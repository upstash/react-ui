import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTTL = () => {
  const { redis } = useDatabrowser();

  const updateTTL = useMutation({
    mutationFn: async ({ dataKey, newTTLValue }: { dataKey?: string; newTTLValue: number }) => {
      if (dataKey === undefined) {
        throw new Error("Key is missing!");
      }
      return Boolean(await redis.expire(dataKey, newTTLValue));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFetchSingleDataByKey"] });
      queryClient.invalidateQueries({ queryKey: ["useFetchTTLByKey"] });
    },
  });
  return updateTTL;
};

export const usePersistTTL = () => {
  const { redis } = useDatabrowser();

  const persistTTL = useMutation({
    mutationFn: async (dataKey?: string) => {
      if (dataKey === undefined) {
        throw new Error("Key is missing!");
      }
      return Boolean(await redis.persist(dataKey));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFetchSingleDataByKey"] });
      queryClient.invalidateQueries({ queryKey: ["useFetchTTLByKey"] });
    },
  });
  return persistTTL;
};
