import { useDatabrowserStore } from "@/store";
import { useKeyType } from "../../hooks/use-keys";
import { EditorDisplay } from "./editor-display";
import { ListDisplay } from "./list-display";

export const DataDisplay = () => {
  const { selectedKey } = useDatabrowserStore();
  const type = useKeyType(selectedKey);

  return (
    <div className="h-full rounded-xl border p-1">
      {!selectedKey || !type ? (
        <div />
      ) : type === "string" || type === "json" ? (
        <EditorDisplay dataKey={selectedKey} type={type} />
      ) : (
        <ListDisplay dataKey={selectedKey} type={type} />
      )}
    </div>
  );
};
