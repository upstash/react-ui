import { useDatabrowserStore } from "@/store"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TypeTag } from "@/components/databrowser/components/type-tag"
import type { RedisKey } from "@/components/databrowser/hooks"

import { useKeys } from "../../hooks/use-keys"

export const KeysList = () => {
  const { keys } = useKeys()

  return (
    <>
      {keys.map((data) => (
        <KeyItem key={data[0]} data={data} />
      ))}
    </>
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
        "relative flex h-10 w-full items-center justify-start gap-3 px-3 py-0 ",
        "border border-transparent text-left",
        isKeySelected && "border-zinc-500 !bg-zinc-100 shadow-sm"
      )}
      onClick={() => setSelectedKey(dataKey)}
    >
      <TypeTag variant={dataType} type="icon" />
      <p className="truncate whitespace-nowrap text-black">{dataKey}</p>

      {!isKeySelected && <span className="absolute -bottom-px left-3 right-3 h-px bg-zinc-100" />}
    </Button>
  )
}
