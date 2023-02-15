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
          overflow: "hidden"
        }}
      >
        <Cli url={upstashRedisRestUrl} token={upstashRedisRestToken} />
      </div>

    </main>
  );
}
