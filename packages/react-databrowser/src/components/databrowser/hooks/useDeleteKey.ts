import { redis, queryClient } from "@/lib/clients";
import { useMutation } from "react-query";

export const useDeleteKey = () => {
  const deleteKey = useMutation(
    async (dataKey?: string) => {
      if (!dataKey) throw new Error("Key is missing!");
      return Boolean(await redis.del(dataKey));
    },
    { onSuccess: () => queryClient.invalidateQueries("useFetchPaginatedKeys") }
  );
  return deleteKey;
};
