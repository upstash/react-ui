import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";
import { checkIsValidJSON } from "./use-field";

const contentTypes = ["Text", "JSON"] as const;
export type ContentType = (typeof contentTypes)[number];

export const ContentTypeSelect = ({
  value,
  onChange,
  data,
}: {
  value: ContentType;
  onChange: (value: ContentType) => void;
  data: string;
}) => {
  const isValidJSON = useMemo(() => checkIsValidJSON(data), [data]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-6 w-auto border-none bg-transparent pr-7 text-zinc-500">
        <SelectValue placeholder="Expires" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(isValidJSON || value === "JSON" ? contentTypes : ["Text"]).map((type) => (
            <SelectItem value={type} key={type}>
              {type}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
