import { useMemo } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { checkIsValidJSON } from "./use-field"

const _contentTypes = ["Text", "JSON"] as const
export type ContentType = (typeof _contentTypes)[number]

export const ContentTypeSelect = ({
  value,
  onChange,
  data,
}: {
  value: ContentType
  onChange: (value: ContentType) => void
  data: string
}) => {
  const isValidJSON = useMemo(() => checkIsValidJSON(data), [data])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-6 w-auto border-none bg-transparent pl-0 pr-6 text-xs text-zinc-500">
        <SelectValue placeholder="Text" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value={"Text"}>Text</SelectItem>
          <SelectItem disabled={!isValidJSON} value={"JSON"}>
            JSON
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
