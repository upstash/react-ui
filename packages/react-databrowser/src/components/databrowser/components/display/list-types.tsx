import { useDatabrowser } from "@/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { transformArray } from "./list-display";
import { ListDataType } from "@/types";

export const LIST_DISPLAY_PAGE_SIZE = 50;

export const useListQuery = ({ dataKey, type }: { dataKey: string; type: ListDataType }) => {
  const { redis } = useDatabrowser();

  const setQuery = useInfiniteQuery({
    enabled: type === "set",
    queryKey: ["list-set", dataKey],
    initialPageParam: "0",
    queryFn: async ({ pageParam: cursor }) => {
      const [nextCursor, keys] = await redis.sscan(dataKey, cursor, { count: LIST_DISPLAY_PAGE_SIZE });

      return {
        cursor: nextCursor,
        keys: (keys as string[]).map((key) => ({ key })),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  const zsetQuery = useInfiniteQuery({
    enabled: type === "zset",
    queryKey: ["list-zset", dataKey],
    initialPageParam: "0",
    queryFn: async ({ pageParam: cursor }) => {
      const res = await redis.zscan(dataKey, cursor, { count: LIST_DISPLAY_PAGE_SIZE });

      return {
        cursor: res[0],
        keys: transformArray(res[1]),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  const hashQuery = useInfiniteQuery({
    enabled: type === "hash",
    queryKey: ["list-hash", dataKey],
    initialPageParam: "0",
    queryFn: async ({ pageParam: cursor }) => {
      const res = await redis.hscan(dataKey, cursor, { count: LIST_DISPLAY_PAGE_SIZE });

      return {
        cursor: res[0],
        keys: transformArray(res[1]),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  const listQuery = useInfiniteQuery({
    enabled: type === "list",
    queryKey: ["list-list", dataKey],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const lastIndex = Number(pageParam);
      const values = await redis.lrange(dataKey, lastIndex, lastIndex + LIST_DISPLAY_PAGE_SIZE);

      return {
        cursor: lastIndex + LIST_DISPLAY_PAGE_SIZE,
        keys: values.map((value, i) => ({ key: (lastIndex + i).toString(), value })),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  const streamQuery = useInfiniteQuery({
    enabled: type === "stream",
    queryKey: ["list-stream", dataKey],
    initialPageParam: "0",
    queryFn: async ({ pageParam: lastId }) => {
      console.log("Args", {
        dataKey,
        lastId,
      });
      const messages = (await redis.xrange(dataKey, lastId, "+", LIST_DISPLAY_PAGE_SIZE)) as unknown as [
        string,
        string[],
      ][];

      const lastMessageId = messages.length > 0 ? messages[messages.length - 1][0] : undefined;

      return {
        cursor: lastMessageId,
        keys: messages.map(([id, fields]) => ({
          key: id,
          value: fields.join("\n"),
        })),
      };
    },

    getNextPageParam: ({ cursor }) => cursor,
  });

  const map = {
    set: setQuery,
    zset: zsetQuery,
    hash: hashQuery,
    list: listQuery,
    stream: streamQuery,
  };

  return map[type];
};
