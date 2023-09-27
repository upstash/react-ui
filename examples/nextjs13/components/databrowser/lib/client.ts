import { Redis } from "@upstash/redis";

export const initializeRedis = () => {
  if (!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL)
    throw new Error("NEXT_PUBLIC_UPSTASH_REDIS_REST_URL is missing");
  if (!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN)
    throw new Error("NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN is missing");

  const redis = new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
  });

  return redis;
};

export const redis = initializeRedis();
