import { DisplayHeader } from "./display-header";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useDatabrowserStore } from "@/store";
import { useMemo } from "react";
import { ListEditDisplay } from "./list-edit-display";
import { useListQuery } from "../../hooks/use-list-query";
import { InfiniteScroll } from "../sidebar/infinite-scroll";
import { ListDataType } from "@/types";

export const ListDisplay = ({ dataKey, type }: { dataKey: string; type: ListDataType }) => {
  const { selectedListItem } = useDatabrowserStore();
  console.log("item", selectedListItem);

  const query = useListQuery({ dataKey, type });

  const headers = {
    list: ["Index", "Content"],
    hash: ["Field", "Value"],
    zset: ["Value", "Score"],
    stream: ["ID", "Value"],
  } as const;

  return (
    <div className="flex h-full flex-col gap-2">
      <DisplayHeader dataKey={dataKey} type={type} hideBadges={selectedListItem !== undefined} />
      {selectedListItem ? (
        <ListEditDisplay dataKey={dataKey} type={type} />
      ) : (
        <InfiniteScroll query={query}>
          <table className="w-full flex-grow  text-sm text-zinc-700">
            {type !== "set" && (
              <thead>
                <td className="px-3 py-2 font-medium">{headers[type][0]}</td>
                {headers[type][1] && <td className="px-3 py-2 font-medium">{headers[type][1]}</td>}
              </thead>
            )}
            <tbody>
              <ListItems query={query} type={type} />
            </tbody>
          </table>
        </InfiniteScroll>
      )}
    </div>
  );
};

export const ListItems = ({
  type,
  query,
}: {
  type: ListDataType;
  query: UseInfiniteQueryResult<
    InfiniteData<{
      keys: ItemData[];
    }>
  >;
}) => {
  const { setSelectedListItem } = useDatabrowserStore();
  const keys = useMemo(() => query.data?.pages.flatMap((page) => page.keys) ?? [], [query.data]);

  return (
    <>
      {keys.map(({ key, value }, i) => (
        <tr
          onClick={() => {
            setSelectedListItem(key, value);
          }}
          className="cursor-pointer border-b hover:bg-zinc-100"
        >
          <td className="px-3 py-2">{key}</td>
          {value && <td className="px-3 py-2">{value}</td>}
        </tr>
      ))}
    </>
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
