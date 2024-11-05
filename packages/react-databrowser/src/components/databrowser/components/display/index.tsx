import { useDatabrowserStore } from "@/store"

import { useKeyType } from "../../hooks/use-keys"
import { ListDisplay } from "./display-list"
import { EditorDisplay } from "./display-simple"

export const DataDisplay = () => {
  const { selectedKey } = useDatabrowserStore()
  const type = useKeyType(selectedKey)

  // TODO: add a empty state
  return (
    <div className="h-full rounded-xl border p-1">
      {!selectedKey || !type ? (
        <div />
      ) : (
        <>
          {type === "string" || type === "json" ? (
            <EditorDisplay dataKey={selectedKey} type={type} />
          ) : (
            <ListDisplay dataKey={selectedKey} type={type} />
          )}
        </>
      )}
    </div>
  )
}
