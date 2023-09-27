"use client";
import { Databrowser } from "@/components/databrowser";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
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
          maxHeight: "40rem",
          maxWidth: "64rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Databrowser />
        </QueryClientProvider>
      </div>
    </main>
  );
}
