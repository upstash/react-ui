import React from "react"
import ReactDOM from "react-dom/client"

import { RedisCli } from "./redis-cli"

import "./cli.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
          token={process.env.UPSTASH_REDIS_REST_TOKEN!}
          url={process.env.UPSTASH_REDIS_REST_URL!}
        />
      </div>
    </main>
  </React.StrictMode>
)
