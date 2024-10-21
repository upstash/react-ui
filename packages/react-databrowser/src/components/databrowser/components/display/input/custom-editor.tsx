import { cn } from "@/lib/utils";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useRef, useEffect } from "react";

export const CustomEditor = ({
  language,
  value,
  onChange,
  maxDynamicHeight,
}: {
  language: string;
  value: string;
  onChange: (value: string) => void;
  maxDynamicHeight?: number;
}) => {
  const monaco = useMonaco();
  const editorRef = useRef(undefined);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    // @ts-ignore
    monaco?.editor.setModelLanguage(editorRef.current.getModel(), language);
  }, [monaco, language]);

  return (
    <div
      className={cn(maxDynamicHeight === undefined && "h-full")}
      style={{
        height: maxDynamicHeight,
      }}
    >
      <Editor
        onMount={(editor) => {
          // @ts-ignore
          editorRef.current = editor;
        }}
        value={value}
        onChange={(value) => {
          onChange(value ?? "");
        }}
        defaultLanguage={language}
        options={{
          wordWrap: "on",
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          formatOnPaste: true,
          formatOnType: true,
          renderWhitespace: "all",
          smoothScrolling: true,
          autoIndent: "full",
          fontSize: 13,
          cursorBlinking: "smooth",
          minimap: {
            enabled: false,
          },
          lineNumbers: "off",
          parameterHints: { enabled: false },
          glyphMargin: false,
          lineDecorationsWidth: 5,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
        }}
      />
    </div>
  );
};
