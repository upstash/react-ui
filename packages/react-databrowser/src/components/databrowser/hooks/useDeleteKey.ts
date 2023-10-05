import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { useMutation } from "react-query";

export const useDeleteKey = () => {
  const { redis } = useDatabrowser();

  const deleteKey = useMutation(
    async (dataKey?: string) => {
      if (!dataKey) throw new Error("Key is missing!");
      return Boolean(await redis.del(dataKey));
    },
    { onSuccess: () => queryClient.invalidateQueries("useFetchPaginatedKeys") },
  );
  return deleteKey;
};
