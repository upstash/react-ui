import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { useMutation } from "@tanstack/react-query";

export const useDeleteKey = () => {
  const { redis } = useDatabrowser();

  const deleteKey = useMutation({
    mutationFn: async (dataKey?: string) => {
      if (dataKey === undefined) {
        throw new Error("Key is missing!");
      }

      return Boolean(await redis.del(dataKey));
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["useFetchPaginatedKeys"],
      }),
  });

  return deleteKey;
};
