import { DataType } from "@/types";
import { DisplayHeader } from "./display-header";
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useDatabrowser, useDatabrowserStore } from "@/store";
import { useMemo } from "react";
import { ListEditDisplay } from "./list-edit-display";
import { DataHashDisplay, DataSetDisplay, DataZSetDisplay } from "./list-types";

export const ListDisplay = ({ dataKey, type }: { dataKey: string; type: DataType }) => {
  const { selectedListItem } = useDatabrowserStore();
  console.log("item", selectedListItem);
  return (
    <div className="flex flex-col gap-2">
      <DisplayHeader dataKey={dataKey} type={type} hideBadges={selectedListItem !== undefined} />
      {selectedListItem ? (
        <ListEditDisplay dataKey={dataKey} type={type} />
      ) : (
        <table className="w-full flex-grow text-sm text-zinc-700">
          <tbody>
            {type === "zset" ? (
              <DataZSetDisplay dataKey={dataKey} />
            ) : type === "set" ? (
              <DataSetDisplay dataKey={dataKey} />
            ) : type === "hash" ? (
              <DataHashDisplay dataKey={dataKey} />
            ) : (
              <>WIP</>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const ListItems = ({
  query,
}: {
  query: UseInfiniteQueryResult<
    InfiniteData<{
      cursor: string;
      keys: ItemData[];
    }>
  >;
}) => {
  const keys = useMemo(() => query.data?.pages.flatMap((page) => page.keys) ?? [], [query.data]);

  return (
    <>
      {keys.map(({ key, value }) => (
        <ListItem key={key} dataKey={key} value={value} />
      ))}
    </>
  );
};

const ListItem = ({ dataKey, value }: { dataKey: string; value?: string }) => {
  const { setSelectedListItem } = useDatabrowserStore();
  return (
    <tr
      onClick={() => {
        setSelectedListItem(dataKey, value);
      }}
      className="cursor-pointer border-b hover:bg-zinc-100"
    >
      <td className="px-3 py-2">{dataKey}</td>
      {value && <td className="px-3 py-2">{value}</td>}
    </tr>
  );
};

type ItemData = {
  key: string;
  value?: string;
};

export function transformArray(inputArray: (string | number)[]): ItemData[] {
  if (inputArray.length % 2 !== 0) {
    throw new Error("The input array length must be even.");
  }

  return inputArray.reduce<ItemData[]>((acc, curr, idx, src) => {
    if (idx % 2 === 0) {
      acc.push({ key: String(curr), value: String(src[idx + 1]) });
    }
    return acc;
  }, []);
}
