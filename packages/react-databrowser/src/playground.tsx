import React from "react";
import ReactDOM from "react-dom/client";
import { Databrowser } from "@/components/databrowser";

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
          maxHeight: "45rem",
          maxWidth: "64rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <Databrowser />
      </div>
    </main>
  </React.StrictMode>,
);
