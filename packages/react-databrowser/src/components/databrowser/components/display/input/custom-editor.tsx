import { useEffect, useRef } from "react"
import { Editor, useMonaco } from "@monaco-editor/react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/databrowser/copy-button"

export const CustomEditor = ({
  language,
  value,
  onChange,
  maxDynamicHeight,
  showCopyButton,
}: {
  language: string
  value: string
  onChange: (value: string) => void
  maxDynamicHeight?: number
  showCopyButton?: boolean
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
      className={cn("group/editor relative", maxDynamicHeight === undefined && "h-full p-2")}
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
      {showCopyButton && (
        <CopyButton
          value={value}
          className="absolute right-0 top-0 hidden group-hover/editor:flex"
        />
      )}
    </div>
  )
}
