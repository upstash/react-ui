import "@/globals.css"

import { useMemo } from "react"
import { DatabrowserProvider, type DatabrowserProps } from "@/store"
import { IconDotsVertical } from "@tabler/icons-react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

import { queryClient } from "@/lib/clients"

import { Toaster } from "../ui/toaster"
import { DataDisplay } from "./components/display"
import { Sidebar } from "./components/sidebar"
import { KeysProvider } from "./hooks/use-keys"

export const Databrowser = ({ token, url }: DatabrowserProps) => {
  const credentials = useMemo(() => ({ token, url }), [token, url])

  return (
    <QueryClientProvider client={queryClient}>
      <DatabrowserProvider databrowser={credentials}>
        <KeysProvider>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={30} minSize={20}>
              <Sidebar />
            </Panel>
            <PanelResizeHandle>
              <div className="mx-1 flex h-full w-4 items-center rounded-md transition-colors hover:bg-zinc-300/20">
                <IconDotsVertical size={16} />
              </div>
            </PanelResizeHandle>
            <Panel minSize={20}>
              <DataDisplay />
            </Panel>
          </PanelGroup>
          <Toaster />
        </KeysProvider>
      </DatabrowserProvider>
    </QueryClientProvider>
  )
}
