import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContentValue } from "../../hooks/useFetchSingleDataByKey/utils";
import { cn } from "@/lib/utils";

type Props = {
  data: ContentValue[];
  tableHeaders: [string | null, string];
};
export const DataTable = ({ data, tableHeaders }: Props) => {
  return (
    <div className="h-[425px] px-2">
      <Table className="border-spacing-10">
        <TableHeader>
          <TableRow className="pointer-events-none border-none">
            {tableHeaders[0] !== null ? (
              <TableHead className="px-2 text-[11px] font-medium text-[#00000066]">{tableHeaders[0]}</TableHead>
            ) : null}
            {tableHeaders[1] !== null ? (
              <TableHead className="px-2 text-[11px] font-medium text-[#00000066]">{tableHeaders[1]}</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx} className="border-none">
              {item.value !== null ? (
                <TableCell
                  className={cn("h-[38px] w-20 border-none text-[14px] font-medium", {
                    "rounded-l bg-[#00000008]": idx % 2 === 0,
                  })}
                >
                  <p className="w-20 overflow-hidden truncate whitespace-nowrap">{item.value}</p>
                </TableCell>
              ) : null}
              {item.content !== null ? (
                <TableCell
                  className={cn(
                    "relative flex h-[38px] items-center overflow-hidden truncate whitespace-break-spaces border-none text-[14px] font-medium",
                    {
                      "rounded-r bg-[#00000008]": idx % 2 === 0,
                      "rounded-l": item.value === null,
                    },
                  )}
                >
                  <p className="w-[200px] overflow-hidden truncate whitespace-nowrap">{item.content}</p>
                  <div className="absolute right-4">
                    <CopyToClipboardButton
                      sizeVariant="icon-xs"
                      variant="ghost"
                      onCopy={() => handleCopyClick(item.content.toString())}
                    />
                  </div>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
