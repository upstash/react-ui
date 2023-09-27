import React from "react";
import { useMutation } from "react-query";
import { redis } from "../lib/client";
import { queryClient } from "@/app/databrowser/page";

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
