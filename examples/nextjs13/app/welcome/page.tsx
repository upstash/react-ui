"use client";
import { RedisCli } from "@upstash/react-cli";

export default function Home() {
  const upstashRedisRestUrl = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
  if (!upstashRedisRestUrl) {
    return <div>UPSTASH_REDIS_REST_URL not set </div>;
  }
  const upstashRedisRestToken = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
  if (!upstashRedisRestToken) {
    return <div>UPSTASH_REDIS_REST_TOKEN not set </div>;
  }

  return <RedisCli url={upstashRedisRestUrl} token={upstashRedisRestToken} welcome={<div>Custom</div>} />;
}
