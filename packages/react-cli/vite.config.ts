import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return defineConfig({
    define: {
      "process.env": env,
    },
    plugins: [react()],
  })
}
