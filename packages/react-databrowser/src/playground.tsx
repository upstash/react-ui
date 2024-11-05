import ReactDOM from "react-dom/client"

import { Databrowser } from "@/components/databrowser"

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <main className="h-screen max-h-full rounded-xl bg-white antialiased">
    <Databrowser
      token={process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}
      url={process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}
    />
  </main>
)
