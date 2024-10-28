import { useDatabrowserStore } from "@/store"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RedisTypeTag } from "@/components/databrowser/components/type-tag"

import { useKeys } from "../../hooks/use-keys"
import type { RedisKey } from "@/components/databrowser/hooks"

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
      className={cn(
        "flex w-full items-center justify-start gap-2 border text-left",
        isKeySelected
          ? "border-emerald-400 bg-emerald-50 shadow-sm hover:bg-emerald-100/60"
          : "border-transparent"
      )}
      variant={isKeySelected ? "default" : "ghost"}
      onClick={() => setSelectedKey(dataKey)}
    >
      <RedisTypeTag type={dataType} isIcon />
      <p className="truncate whitespace-nowrap text-black">{dataKey}</p>
    </Button>
  )
}
