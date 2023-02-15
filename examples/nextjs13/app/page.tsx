import { Cli } from "./cli";
export default function Home() {
  const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
  if (!upstashRedisRestUrl) {
    return <div>UPSTASH_REDIS_REST_URL not set </div>;
  }
  const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;
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
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "48rem",
          maxHeight: "32rem",
        }}
      >
        <Cli url={upstashRedisRestUrl} token={upstashRedisRestToken} />
      </div>
    </main>
  );
}
