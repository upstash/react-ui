import { queryClient } from "@/lib/clients";
import { useDatabrowser } from "@/store";
import { useMutation } from "@tanstack/react-query";

export const useAddKey = () => {
  const { redis } = useDatabrowser();

  const mutation = useMutation({
    mutationFn: async ({ key, value, ex }: { key: string; value: string; ex?: number }) => {
      const res = await redis.set(key, value, ex ? { ex } : undefined);

      return res === "OK";
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["useFetchPaginatedKeys"],
      }),
  });
  return mutation;
};
