import { DataType } from "@/types";
import { DisplayHeader } from "./display-header";

export const ListDisplay = ({ dataKey, type }: { dataKey: string; type: DataType }) => {
  return <div>
    <DisplayHeader dataKey={dataKey} type={type} />
    <div></div>
  </div>
};
