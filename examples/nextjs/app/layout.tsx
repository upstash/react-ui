import "@upstash/react-cli/dist/index.css";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={inter.className}>
        {" "}
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
              maxHeight: "50rem",
              maxWidth: "64rem",
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}
          >
            <div className="nav-container">
              <a href="/databrowser" className="nav-link">
                Databrowser
              </a>
              <a href="/" className="nav-link">
                CLI
              </a>
            </div>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
