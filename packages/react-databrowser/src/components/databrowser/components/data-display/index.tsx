import { useDatabrowserStore } from "@/store";

// export const DataDisplayContainer = () => {
//   return (
//     <div className="col-span-4">
//       <div className="h-full py-1 pr-1">
//         <div className="h-full space-y-6 rounded-lg bg-white" style={{ boxShadow: "0px 0px 6px 0px #0000001A" }}>
//           <DataDisplay
//             selectedDataKeyTypePair={selectedDataKeyTypePair}
//             key={selectedDataKeyTypePair[0]}
//             onDataKeyChange={onDataKeyChange}
//             dataFetchTimestamp={dataFetchTimestamp}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

export const DataDisplay = () => {
  const { selectedKey } = useDatabrowserStore();

  return <div>Selected key: {selectedKey}</div>;
};
