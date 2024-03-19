import { useState } from "react";
import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ContentValue } from "../../hooks/useFetchSingleDataByKey/utils";

type Props = {
  data: ContentValue[];
  tableHeaders: [string | null, string];
};
export const DataTable = ({ data, tableHeaders }: Props) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="h-[425px] px-2">
      <Table className="border-spacing-10">
        <TableHeader>
          <TableRow className="pointer-events-none border-none">
            {tableHeaders[0] !== null ? (
              <TableHead className="px-3 text-[11px] font-medium text-[#00000066]">{tableHeaders[0]}</TableHead>
            ) : null}
            {tableHeaders[1] !== null ? (
              <TableHead className="px-3 text-[11px] font-medium text-[#00000066]">{tableHeaders[1]}</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow
              key={idx}
              className="border-none hover:bg-transparent"
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {item.value !== null ? (
                <TableCell
                  className={cn(
                    " relative h-[38px] w-[10rem] flex-row overflow-hidden truncate whitespace-break-spaces border-none px-3 text-[14px] font-normal",
                    {
                      "rounded-l bg-[#00000008]": idx % 2 === 0,
                    },
                  )}
                >
                  <p className="w-[120px] overflow-hidden truncate whitespace-nowrap ">{item.value}</p>
                  {hoveredRow === idx && (
                    <div className="absolute right-0 top-[5px]">
                      <CopyToClipboardButton
                        sizeVariant="icon-sm"
                        variant="ghost"
                        onCopy={() => handleCopyClick(item.value !== null ? item.value.toString() : "")}
                        svgSize={{ h: 22, w: 22 }}
                      />
                    </div>
                  )}
                </TableCell>
              ) : null}
              {item.content !== null ? (
                <TableCell
                  className={cn(
                    "relative flex h-[38px] items-center overflow-hidden truncate whitespace-break-spaces border-none px-3  text-[14px] font-normal",
                    {
                      "rounded-r bg-[#00000008]": idx % 2 === 0,
                      "rounded-l": item.value === null,
                    },
                  )}
                >
                  <p className="w-[200px] overflow-hidden truncate whitespace-nowrap">{item.content}</p>
                  {hoveredRow === idx && (
                    <div className="absolute right-[10px] top-[5px]">
                      <CopyToClipboardButton
                        sizeVariant="icon-sm"
                        variant="ghost"
                        onCopy={() => handleCopyClick(item.content.toString())}
                        svgSize={{ h: 22, w: 22 }}
                      />
                    </div>
                  )}
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
