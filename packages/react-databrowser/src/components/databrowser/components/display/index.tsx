import { useDatabrowserStore } from "@/store";
import { useKeyType } from "../../hooks/useKeys";
import { DisplayHeader } from "./display-header";
import { DataType } from "@/types";

export const DataDisplay = () => {
  const { selectedKey } = useDatabrowserStore();
  const type = useKeyType(selectedKey);

  return (
    <div className="h-full rounded-xl border p-1">
      {!selectedKey || !type ? <div /> : <EditorDisplay dataKey={selectedKey} type={type} />}
    </div>
  );
};

export const EditorDisplay = ({ dataKey, type }: { dataKey: string; type: DataType }) => {
  return (
    <div className="h-full w-full">
      <DisplayHeader dataKey={dataKey} type={type} size={10000} length={1234} />
    </div>
  );
};
