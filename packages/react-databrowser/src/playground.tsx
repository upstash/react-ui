import ReactDOM from "react-dom/client"

import { Databrowser } from "@/components/databrowser"

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <main
    style={{
      height: "100vh",
      width: "100vw",
      paddingTop: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      background: "rgb(250,250,250)",
    }}
  >
    <div
      style={{
        height: "30rem",
        width: "100%",
        maxHeight: "30rem",
        maxWidth: "64rem",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      <Databrowser
        token={process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}
        url={process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}
      />
    </div>
  </main>
)
