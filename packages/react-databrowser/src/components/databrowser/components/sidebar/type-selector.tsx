import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDatabrowserStore } from "@/store";
import { KEY_NAMES, DataType } from "@/types";

const ALL_TYPES_KEY = "all";

export function DataTypeSelector() {
  const { search, setSearchType } = useDatabrowserStore();

  return (
    <Select
      onValueChange={(type: DataType | typeof ALL_TYPES_KEY) => {
        console.log(type);
        if (type === ALL_TYPES_KEY) setSearchType(undefined);
        else setSearchType(type);
      }}
      value={search.type === undefined ? ALL_TYPES_KEY : search.type}
    >
      <SelectTrigger className="h-[32px] !w-auto whitespace-nowrap rounded-lg rounded-r-none border-r-0 border-zinc-300 pr-7">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {[[ALL_TYPES_KEY, "All Types"], ...Object.entries(KEY_NAMES)].map(([key, value]) => (
            <SelectItem value={key} key={key}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
