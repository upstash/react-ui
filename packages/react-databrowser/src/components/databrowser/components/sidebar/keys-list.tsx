import { useDatabrowserStore } from "@/store"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TypeTag } from "@/components/databrowser/components/type-tag"
import type { RedisKey } from "@/components/databrowser/hooks"

import { useKeys } from "../../hooks/use-keys"

export const KeysList = () => {
  const { keys } = useKeys()

  return (
    <div className="pr-3">
      {keys.map((data) => (
        <KeyItem key={data[0]} data={data} />
      ))}
    </div>
  )
}

const KeyItem = ({ data }: { data: RedisKey }) => {
  const { selectedKey, setSelectedKey } = useDatabrowserStore()

  const [dataKey, dataType] = data
  const isKeySelected = selectedKey === dataKey

  return (
    <Button
      key={dataKey}
      variant={isKeySelected ? "default" : "ghost"}
      className={cn(
        "relative flex h-10 w-full items-center justify-start gap-2 px-3 py-0 ",
        "select-none border border-transparent text-left",
        isKeySelected && "shadow-sm",
        isKeySelected && dataType === "string" && "border-sky-400 !bg-sky-50 text-sky-900",
        isKeySelected && dataType === "list" && "border-orange-400 !bg-orange-50 text-orange-900",
        isKeySelected && dataType === "hash" && "border-amber-400 !bg-amber-50 text-amber-900",
        isKeySelected && dataType === "set" && "border-indigo-400 !bg-indigo-50 text-indigo-900",
        isKeySelected && dataType === "zset" && "border-pink-400  !bg-pink-50 text-pink-900",
        isKeySelected && dataType === "json" && "border-purple-400 !bg-purple-50 text-purple-900",
        isKeySelected && dataType === "stream" && "border-orange-400 !bg-orange-50 text-orange-900"
      )}
      onClick={() => setSelectedKey(dataKey)}
    >
      <TypeTag variant={dataType} type="icon" />
      <p className="truncate whitespace-nowrap">{dataKey}</p>

      {!isKeySelected && <span className="absolute -bottom-px left-3 right-3 h-px bg-zinc-100" />}
    </Button>
  )
}
