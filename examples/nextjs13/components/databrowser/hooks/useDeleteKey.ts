import { useMutation } from "react-query";
import { queryClient } from "..";
import { redis } from "../lib/client";

export const useDeleteKey = () => {
  const deleteKey = useMutation(
    async (dataKey?: string) => {
      if (!dataKey) throw new Error("dataKey is missing!");
      return Boolean(await redis.del(dataKey));
    },
    { onSuccess: () => queryClient.invalidateQueries("useFetchPaginatedKeys") }
  );
  return deleteKey;
};
