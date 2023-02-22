import { spawn } from "child_process";
import React, { PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";
import "./tailwind.css";
export type CliProps = {
  url: string;
  token: string;

  /**
   * The className prop is used to add custom styles to the cli and applied to the root element
   */
  className?: string;
};
type Command = {
  time: number;
  command: string;
  result?: string | null | number | boolean | string[] | React.ReactNode;
  error?: boolean;
};

export const RedisCli: React.FC<CliProps> = (props) => {
  /**
   * Holds a unique set of command inputs
   */
  const [history, setHistory] = useState<string[]>([]);

  /**
   * Used to cycle through the history with the up and down arrow keys
   */
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  /**
   * Holds all commands that have been executed and their results
   */
  const [commands, setCommands] = useState<Command[]>([]);

  /**
   * Adds a command to the
   */
  function addCommand(command: Command) {
    setHistory((prev) => {
      if (prev.length === 0 || prev[0] !== command.command) {
        return [command.command, ...prev];
      }
      return prev;
    });
    setCommands((prev) => [...prev, command]);
  }
  /**
   * Used to show a loading indicator when querying redis
   */
  const [loading, setLoading] = useState(false);

  /**
   * stdin is the input that the user types in the cli
   */
  const [stdin, setStdin] = useState("");

  const specialCommands: Record<string, () => void> = {
    clear: () => {
      setCommands([]);
      setHistoryIndex(null);
      setStdin("");
    },
    help: () => {
      addCommand({
        time: Date.now(),
        command: "help",
        result: (
          <div>
            <p>You can execute Redis commands in the terminal:</p>
            <a
              className="text-[#00e9a3] hover:underline"
              href="https://upstash.com/redis-api-compatibility"
              target="_blank"
              rel="noreferrer"
            >
              https://upstash.com/redis-api-compatibility
            </a>
            <br />
            <div className="flex flex-col items-start p-2 mt-2 border">
              <span>Try</span>
              <button onClick={() => setStdin("GET key")}>
                <pre>&gt; GET key</pre>
              </button>
              <button onClick={() => setStdin("LPUSH list e1 e2")}>
                <pre>&gt; LPUSH list e1 e2</pre>
              </button>
            </div>

            <div className="flex flex-col items-start p-2 mt-2 border">
              <span>Special commands</span>
              <button onClick={() => setStdin("clear")}>
                <pre>&gt; clear</pre>
              </button>
              <button onClick={() => setStdin("help")}>
                <pre>&gt; help</pre>
              </button>
            </div>
          </div>
        ),
      });
    },
  };

  /**
   * When the user cycles through the history with the up and down arrow keys,
   * the input should be updated to the command that they are currently on
   */
  useEffect(() => {
    if (historyIndex === null) return;
    const cmd = history[historyIndex];
    if (!cmd) return;
    setStdin(cmd);
  }, [historyIndex, history]);

  const ref = useRef<HTMLInputElement>(null);

  /**
   * When the user presses enter, we first check if the command is a special command
   * (e.g. clear, help). If it is, we execute the special command. Otherwise, we
   * send the command to redis and display the result.
   */
  const onEnter = async () => {
    try {
      if (loading) return;
      setLoading(true);

      const command = stdin.trim();
      if (!command) {
        addCommand({ command, result: "", time: Date.now() });
        return;
      }
      if (specialCommands[command]) {
        specialCommands[command]();
        return;
      }

      await new Promise((r) => setTimeout(r, 1000));

      const args = splitArgs(command);

      const res = await fetch(props.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify(args),
      });
      const json = (await res.json()) as { result?: string; error?: string };
      addCommand({ command, result: json.error ?? json.result, error: !!json.error, time: Date.now() });
    } catch (e) {
      const err = e as Error;
      console.error(err.message);
    } finally {
      setHistoryIndex(null);
      setLoading(false);
      setStdin("");
      /**
       * We need a timeout here because react needs to update the dom before we can scroll to the
       * bottom of the cli. If we don't wait, scrollIntoView will scroll to the same place as
       * before
       */
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 10);
    }
  };

  return (
    <div
      className={`relative flex flex-col w-full h-full p-4 font-mono text-gray-100 bg-black ${props.className}`}
      onMouseUp={() => {
        /**
         * The behaviour should be:
         * 1. If the user clicks anywhere on the cli, the input should be focused
         * 2. If the user selects some text, the input should not be focused because the user is
         *    probably trying to copy some text
         */
        if (window?.getSelection()?.type !== "Range") {
          ref.current?.focus();
        }
      }}
    >
      <div className="flex flex-col flex-grow h-full overflow-y-scroll break-all">
        <span className="text-[#00e9a3]">Welcome to Upstash CLI</span>
        {commands.map((r) => (
          <Result key={r.time} command={r} />
        ))}

        <Line className={loading ? "animate-pulse" : ""} prefix={<span>➜</span>}>
          <input
            type="text"
            spellCheck={false}
            key="stdin"
            style={{
              resize: "none",
            }}
            ref={ref}
            // rows={Math.max(stdin.split("\n").length, Math.ceil(stdin.length / 80), 1)}
            value={stdin}
            onChange={(e) => setStdin(e.currentTarget.value)}
            onKeyDown={async (e) => {
              if (e.ctrlKey && e.key === "c") {
                e.preventDefault();
                addCommand({ command: `${stdin}^C`, time: Date.now() });
                setStdin("");
                return;
              }

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                await onEnter();
                return;
              }
              if (e.key === "ArrowUp") {
                if (history.length === 0) {
                  setHistoryIndex(null);
                  return;
                }
                setHistoryIndex(Math.min(history.length - 1, historyIndex === null ? 0 : historyIndex + 1));
                return;
              }
              if (e.key === "ArrowDown") {
                if (history.length === 0) {
                  setHistoryIndex(null);
                  return;
                }
                setHistoryIndex(Math.max(0, historyIndex === null ? history.length - 1 : historyIndex - 1));
                return;
              }
            }}
            className="w-full  placeholder-gray-600 bg-transparent border-none outline-none caret-[#00e9a3] focus:outline-none"
          />
        </Line>
      </div>
    </div>
  );
};

const Line: React.FC<PropsWithChildren<{ prefix?: React.ReactNode; className?: string }>> = ({
  className,
  prefix,
  children,
}) => (
  <div className={`relative flex items-center my-2 w-full ${className}`}>
    <div className="absolute inset-y-0 w-4 h-full">{prefix ?? <span> </span>}</div>
    <div className="flex flex-col items-start w-full ml-4">{children}</div>
  </div>
);
/**
 *  splitArgs splits the command into an array of arguments by spaces
 * it handles single and double quotes correctly
 */
function splitArgs(input: string): string[] {
  const separator = /\s/g;
  let singleQuoteOpen = false;
  let doubleQuoteOpen = false;
  let tokenBuffer = [];
  const ret = [];

  const arr = input.split("");
  for (var i = 0; i < arr.length; ++i) {
    var element = arr[i];
    var matches = element.match(separator);
    if (element === "'" && !doubleQuoteOpen) {
      singleQuoteOpen = !singleQuoteOpen;
      continue;
    } else if (element === '"' && !singleQuoteOpen) {
      doubleQuoteOpen = !doubleQuoteOpen;
      continue;
    }

    if (!(singleQuoteOpen || doubleQuoteOpen) && matches) {
      if (tokenBuffer.length > 0) {
        ret.push(tokenBuffer.join(""));
        tokenBuffer = [];
      } else {
        ret.push(element);
      }
    } else {
      tokenBuffer.push(element);
    }
  }
  if (tokenBuffer.length > 0) {
    ret.push(tokenBuffer.join(""));
  } else {
    ret.push("");
  }
  return ret;
}

const Result: React.FC<{ command: Command }> = ({ command }) => {
  return (
    <div className="mb-2">
      <Line prefix={command.error ? <span className="text-red-500">✗</span> : <span>➜</span>}>
        <span>{command.command}</span>
      </Line>
      {typeof command.result !== "undefined" ? (
        <Line>
          <div className={`font-mono whitespace-pre-wrap break-words ${command.error ? "text-red-500" : ""}`}>
            {formatResult(command.result)}
          </div>
        </Line>
      ) : null}
    </div>
  );
};

function formatResult(result: Command["result"]): string | ReactNode {
  console.log({ result });

  switch (typeof result) {
    case "undefined":
      return "";
    case "boolean":
    case "number":
      return result.toString();
    case "object":
      if (result === null) {
        return "nil";
      }
      if (Array.isArray(result)) {
        return result.map(formatResult).join(", ");
      }

    default:
      return result;
  }
}
