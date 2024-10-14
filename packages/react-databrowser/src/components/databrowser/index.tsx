import "@/globals.css";
import { queryClient } from "@/lib/clients";
import { type DatabrowserProps, DatabrowserProvider } from "@/store";
import { useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../ui/toaster";
import { Sidebar } from "./components/sidebar";
import { DataDisplay } from "./components/data-display";
import { KeysProvider } from "./hooks/useKeys";

export const Databrowser = ({ token, url }: DatabrowserProps) => {
  const credentials = useMemo(() => ({ token, url }), [token, url]);

  return (
    <QueryClientProvider client={queryClient}>
      <DatabrowserProvider databrowser={credentials}>
        <KeysProvider>
          <div className="flex overflow-hidden rounded-xl border border-zinc-200 p-1">
            <Sidebar />
            <DataDisplay />
            <Toaster />
          </div>
        </KeysProvider>
      </DatabrowserProvider>
    </QueryClientProvider>
  );
};
