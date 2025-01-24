"use client";
import { Databrowser } from "@upstash/react-databrowser";
import "@upstash/react-databrowser/dist/index.css";

export default function DatabrowserDemo() {
  const upstashRedisRestUrl = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
  if (!upstashRedisRestUrl) {
    return <div>UPSTASH_REDIS_REST_URL not set </div>;
  }
  const upstashRedisRestToken = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
  if (!upstashRedisRestToken) {
    return <div>UPSTASH_REDIS_REST_TOKEN not set </div>;
  }

  return <Databrowser url={upstashRedisRestUrl} token={upstashRedisRestToken} />;
}
