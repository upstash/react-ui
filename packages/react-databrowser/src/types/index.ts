export const RedisDataTypes = ["string", "list", "hash", "set", "zset", "json", "stream"] as const;
export type RedisDataTypeUnion = (typeof RedisDataTypes)[number];
export type ActionVariants = "reset" | "filter" | "search" | "next" | "prev";
