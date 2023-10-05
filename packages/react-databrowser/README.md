<div align="center">
    <h1 align="center">@upstash/react-databrowser</h1>
    <h5>Databrowser for Upstash Redis</h5>
</div>

<div align="center">
  <a href="https://upstash-react-cli.vercel.app/">upstash-react-cli.vercel.app</a>
</div>
<br/>


## 1. Install

```sh-session
$ npm install @upstash/react-databrowser
```

## 2. Add env keys
```sh-session
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=XXX
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=XXX
```

## 3. Add a client component in your app:

```tsx
// /app/components/databrowser.tsx

"use client";
import { Databrowser } from "@upstash/react-databrowser";
import "@upstash/react-databrowser/dist/index.css";

export default function DatabrowserDemo() {
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
          maxHeight: "45rem",
          maxWidth: "64rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <Databrowser />
      </div>
    </main>
  );
}

```