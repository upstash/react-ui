import React, { PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import "./cli.css";

type CommandContext = {
  setStdin: (s: string) => void;
  /**
   * Adds a new command to stdin and pushes it to the history
   */
  addCommand: (command: CommandResult) => void;
};

type Command = (ctx: CommandContext) => void | Promise<void>;

export type CliProps = {
  url: string;
  token: string;
  welcome?: ReactNode;

  /**
   * trigger one or multiple commands to run on start
   *
   * For example `init: "help"` shows the help
   */
  init?: string | string[];

  /**
   * The className prop is used to add custom styles to the cli and applied to the root element
   */
  className?: string;

  commands?: Record<string, Command>;
};

type CommandResult = {
  /**
   * @default Date.now()
   */
  time?: number;
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
  const [results, setResults] = useState<CommandResult[]>([]);

  /**
   * Adds a command to the history
   */
  function addCommand(command: CommandResult) {
    command.time ??= Date.now();
    setHistory((prev) => {
      if (prev.length === 0 || prev[0] !== command.command) {
        return [command.command, ...prev];
      }
      return prev;
    });
    setResults((prev) => [...prev, command]);
  }
  /**
   * Used to show a loading indicator when querying redis
   */
  const [loading, setLoading] = useState(false);

  /**
   * stdin is the input that the user types in the cli
   */
  const [stdin, setStdin] = useState("");

  const specialCommands: Record<string, Command> = {
    clear: (ctx) => {
      setResults([]);
      setHistoryIndex(null);
      setStdin("");
    },
    help: (ctx) => {
      ctx.addCommand({
        time: Date.now(),
        command: "help",
        result: (
          <div>
            <p>You can execute Redis commands in the terminal:</p>
            <a
              className="upstash-cli-link"
              href="https://upstash.com/redis-api-compatibility"
              target="_blank"
              rel="noreferrer"
            >
              https://upstash.com/redis-api-compatibility
            </a>
            <br />
            <div className="upstash-cli-help-command">
              <span>Try</span>
              <button className="upstash-cli-code" onClick={() => ctx.setStdin("GET key")}>
                &gt; GET key
              </button>
              <button className="upstash-cli-code" onClick={() => ctx.setStdin("LPUSH list e1 e2")}>
                &gt; LPUSH list
              </button>
            </div>

            <div className="upstash-cli-help-command">
              <span>Special commands</span>
              <button className="upstash-cli-code" onClick={() => ctx.setStdin("clear")}>
                &gt; clear{" "}
              </button>
              <button className="upstash-cli-code" onClick={() => ctx.setStdin("help")}>
                &gt; help{" "}
              </button>
            </div>
          </div>
        ),
      });
    },
    ...props.commands,
  };

  /**
   * Run a command against redis and write the command to history
   */
  async function runRedisCommand(command: string): Promise<void> {
    try {
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
      console.error(e);
      addCommand({ command, error: true, result: (e as Error).message, time: Date.now() });
    }
  }

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
        addCommand({ command, time: Date.now() });
        return;
      }
      if (specialCommands[command]) {
        specialCommands[command]({
          setStdin,
          addCommand,
        });
        return;
      }

      // await new Promise((r) => setTimeout(r, 1000));

      await runRedisCommand(command);
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

  useEffect(() => {
    async function run() {
      if (!props.init) {
        return;
      }
      try {
        const commands = Array.isArray(props.init) ? props.init : [props.init];
        for (const command of commands) {
          const cmd = specialCommands[command];
          if (cmd) {
            cmd({
              setStdin,
              addCommand,
            });
          } else {
            await runRedisCommand(command);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    run();
  }, [props.init]);

  return (
    <div
      className={`upstash-cli ${props.className}`}
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
      <ScrollArea.Root style={{ overflow: "hidden" }}>
        <ScrollArea.Viewport className="upstash-cli-viewport">
          <span style={{ color: "#00e9a3" }}>{props.welcome ?? "Welcome to Upstash CLI"}</span>
          {results.map((r) => (
            <Result key={r.time} result={r} />
          ))}

          <Line className={loading ? "upstash-cli-loading" : ""} prefix={<span>➜</span>}>
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
              className="upstash-cli-stdin"
            />
          </Line>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="upstash-cli-scrollbar" orientation="vertical">
          <ScrollArea.Thumb className="upstash-cli-scrollbar-thumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner style={{ background: "black" }} />
      </ScrollArea.Root>
    </div>
  );
};

const Line: React.FC<PropsWithChildren<{ prefix?: React.ReactNode; className?: string }>> = ({
  className,
  prefix,
  children,
}) => (
  <div className={["upstash-cli-line", className].join(" ")}>
    <div className="upstash-cli-line-prefix">{prefix ?? <span> </span>}</div>
    <div className="upstash-cli-line-content">{children}</div>
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
  for (let i = 0; i < arr.length; ++i) {
    const element = arr[i];
    const matches = element.match(separator);
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

const Result: React.FC<{ result: CommandResult }> = ({ result }) => {
  return (
    <>
      <Line
        prefix={
          result.error ? (
            <span
              style={{
                color: "#EF4444",
              }}
            >
              ✗
            </span>
          ) : (
            <span>➜</span>
          )
        }
      >
        <span>{result.command}</span>
      </Line>
      {typeof result.result !== "undefined" ? (
        <Line>
          <div
            className="upstash-cli-result"
            style={{
              color: result.error ? "#EF4444" : undefined,
            }}
          >
            {formatResult(result.result)}
          </div>
        </Line>
      ) : null}
    </>
  );
};

function formatResult(result: CommandResult["result"]): string | ReactNode {
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
