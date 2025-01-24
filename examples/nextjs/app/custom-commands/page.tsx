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

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "rgb(250,250,250)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          maxHeight: "32rem",
          maxWidth: "48rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <RedisCli
          url={upstashRedisRestUrl}
          token={upstashRedisRestToken}
          welcome="Hello from Vercel"
          commands={{
            hello: (ctx) => {
              ctx.addCommand({
                command: "hello",
                result: "world",
              });
            },
            complex: async (ctx) => {
              const res = await fetch("https://jsonplaceholder.typicode.com/todos/1").then((response) =>
                response.text(),
              );

              ctx.addCommand({
                command: "complex",
                result: <div style={{ color: "yellow" }}>{res}</div>,
              });
            },
          }}
        />
      </div>
    </main>
  );
}
