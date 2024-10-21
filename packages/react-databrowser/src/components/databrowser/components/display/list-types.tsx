import { useDatabrowser } from "@/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { transformArray, ListItems } from "./list-display";

export const LIST_PAGE_SIZE = 50;

export const DataZSetDisplay = ({ dataKey }: { dataKey: string }) => {
  const { redis } = useDatabrowser();
  const query = useInfiniteQuery({
    queryKey: ["list", dataKey],
    initialPageParam: "0",
    queryFn: async ({ pageParam: cursor }) => {
      const res = await redis.zscan(dataKey, cursor, { count: LIST_PAGE_SIZE });

      return {
        cursor: res[0],
        keys: transformArray(res[1]),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  return <ListItems query={query} />;
};

export const DataSetDisplay = ({ dataKey }: { dataKey: string }) => {
  const { redis } = useDatabrowser();
  const query = useInfiniteQuery({
    queryKey: ["list", dataKey],
    initialPageParam: "0",
    queryFn: async ({ pageParam: cursor }) => {
      const [nextCursor, keys] = await redis.sscan(dataKey, cursor, { count: LIST_PAGE_SIZE });

      return {
        cursor: nextCursor,
        keys: (keys as string[]).map((key) => ({ key })),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  return <ListItems query={query} />;
};

export const DataHashDisplay = ({ dataKey }: { dataKey: string }) => {
  const { redis } = useDatabrowser();
  const query = useInfiniteQuery({
    queryKey: ["list", dataKey],
    initialPageParam: "0",
    queryFn: async ({ pageParam: cursor }) => {
      const res = await redis.hscan(dataKey, cursor, { count: LIST_PAGE_SIZE });

      return {
        cursor: res[0],
        keys: transformArray(res[1]),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  return <ListItems query={query} />;
};
