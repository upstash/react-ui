"use client";
import { DataDisplayContainer } from "@/components/databrowser/data-display/data-display-container";
import { Sidebar } from "@/components/sidebar";

export const RedisDataTypes = ["string", "list", "hash", "set", "zset", "json"] as const;
export type RedisDataTypeUnion = (typeof RedisDataTypes)[number];

export type ActionVariants = "reset" | "filter" | "search" | "next" | "prev";

export default function Databrowser() {
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
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
          <div className="hidden md:block">
            <div className="border-t">
              <div className="bg-background">
                <div className="grid lg:grid-cols-[1.5fr,1.2fr,1fr,1fr,1fr]">
                  <Sidebar />
                  <DataDisplayContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
