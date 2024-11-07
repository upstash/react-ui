import { useEffect, useRef } from "react"
import { Editor, useMonaco } from "@monaco-editor/react"

import { cn } from "@/lib/utils"

export const CustomEditor = ({
  language,
  value,
  onChange,
  maxDynamicHeight,
}: {
  language: string
  value: string
  onChange: (value: string) => void
  maxDynamicHeight?: number
}) => {
  const monaco = useMonaco()
  const editorRef = useRef()

  useEffect(() => {
    if (!monaco || !editorRef.current) {
      return
    }

    // @ts-expect-error not typing the editor type
    monaco?.editor.setModelLanguage(editorRef.current.getModel(), language)
  }, [monaco, language])

  return (
    <div
      className={cn(maxDynamicHeight === undefined && "h-full p-2")}
      style={{
        height: maxDynamicHeight,
      }}
    >
      <Editor
        loading={undefined}
        onMount={(editor) => {
          // @ts-expect-error not typing the editor type
          editorRef.current = editor
        }}
        value={value}
        onChange={(value) => {
          onChange(value ?? "")
        }}
        defaultLanguage={language}
        options={{
          wordWrap: "on",
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          formatOnPaste: true,
          formatOnType: true,
          renderWhitespace: "none",
          smoothScrolling: true,
          autoIndent: "full",
          guides: {
            indentation: false,
          },
          fontSize: 13,
          cursorBlinking: "smooth",
          minimap: {
            enabled: false,
          },
          folding: false,
          glyphMargin: false,
          lineNumbers: "off",
          parameterHints: { enabled: false },
          lineDecorationsWidth: 0,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
        }}
      />
    </div>
  )
}
