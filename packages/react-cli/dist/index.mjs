// src/redis-cli.tsx
import { useEffect, useRef, useState } from "react";
var RedisCli = (props) => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [commands, setCommands] = useState([]);
  function addCommand(command) {
    setHistory((prev) => {
      if (prev.length === 0 || prev[0] !== command.command) {
        return [command.command, ...prev];
      }
      return prev;
    });
    setCommands((prev) => [...prev, command]);
  }
  const [loading, setLoading] = useState(false);
  const [stdin, setStdin] = useState("");
  const specialCommands = {
    clear: () => {
      setCommands([]);
      setHistoryIndex(null);
      setStdin("");
    },
    help: () => {
      addCommand({
        time: Date.now(),
        command: "help",
        result: <div>
          <p>You can execute Redis commands in the terminal:</p>
          <a
            className="text-[#00e9a3] hover:underline"
            href="https://upstash.com/redis-api-compatibility"
            target="_blank"
            rel="noreferrer"
          >https://upstash.com/redis-api-compatibility</a>
          <br />
          <div className="flex flex-col items-start p-2 mt-2 border">
            <span>Try</span>
            <button onClick={() => setStdin("GET key")}><pre>{"> GET key"}</pre></button>
            <button onClick={() => setStdin("LPUSH list e1 e2")}><pre>{"> LPUSH list e1 e2"}</pre></button>
          </div>
          <div className="flex flex-col items-start p-2 mt-2 border">
            <span>Special commands</span>
            <button onClick={() => setStdin("clear")}><pre>{"> clear"}</pre></button>
            <button onClick={() => setStdin("help")}><pre>{"> help"}</pre></button>
          </div>
        </div>
      });
    }
  };
  useEffect(() => {
    if (historyIndex === null)
      return;
    const cmd = history[historyIndex];
    if (!cmd)
      return;
    setStdin(cmd);
  }, [historyIndex, history]);
  const ref = useRef(null);
  const [height, setHeight] = useState("100%");
  useEffect(() => {
    setHeight(`${ref.current?.scrollHeight ?? 0}px`);
  }, [ref, stdin]);
  const onEnter = async () => {
    try {
      if (loading)
        return;
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
      await new Promise((r) => setTimeout(r, 1e3));
      const args = splitArgs(command);
      const res = await fetch(props.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`
        },
        body: JSON.stringify(args)
      });
      const json = await res.json();
      addCommand({ command, result: json.error ?? json.result, error: !!json.error, time: Date.now() });
    } catch (e) {
      const err = e;
      console.error(err.message);
    } finally {
      setHistoryIndex(null);
      setLoading(false);
      setStdin("");
    }
  };
  return <div
    className="relative flex flex-col w-full h-full p-4 font-mono text-gray-200 bg-black"
    onMouseUp={() => {
      if (window?.getSelection()?.type !== "Range") {
        ref.current?.focus();
      }
    }}
  ><div className="flex flex-col flex-grow h-full overflow-y-scroll break-all">
    <span className="text-[#00e9a3]">Welcome to Upstash CLI</span>
    {commands.map((r) => <Result key={r.time} command={r} />)}
    <div><Line className={loading ? "animate-pulse" : ""} prefix={<span>{"\u279C"}</span>}><textarea
      spellCheck={false}
      key="stdin"
      style={{
        resize: "none",
        height
      }}
      ref={ref}
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
      className="w-full h-full break-all placeholder-gray-600 bg-transparent border-none outline-none caret-[#00e9a3] focus:outline-none"
    /></Line></div>
  </div></div>;
};
var Line = ({
  className,
  prefix,
  children
}) => <div className={`relative flex items-center my-2 w-full ${className}`}>
  <div className="absolute inset-y-0 w-4">{prefix ?? <span> </span>}</div>
  <div className="flex flex-col items-start w-full ml-4">{children}</div>
</div>;
function splitArgs(input) {
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
var Result = ({ command }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [ref]);
  return <div ref={ref} className="mb-2">
    <Line prefix={command.error ? <span className="text-red-500">{"\u2717"}</span> : <span>{"\u279C"}</span>}><span>{command.command}</span></Line>
    {typeof command.result !== "undefined" ? <Line><span className={command.error ? "text-red-500" : ""}>{formatResult(command.result)}</span></Line> : null}
  </div>;
};
function formatResult(result) {
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
export {
  RedisCli
};
//# sourceMappingURL=index.mjs.map