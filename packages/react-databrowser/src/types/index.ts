export const RedisDataTypes = ["string", "list", "hash", "set", "zset", "json", "stream"] as const;

export type RedisDataTypeUnion = (typeof RedisDataTypes)[number] | "All Types";
export type ActionVariants = "reset" | "filter" | "search" | "next" | "prev";
