import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContentValue } from "../../hooks/useFetchSingleDataByKey/utils";

type Props = {
  data: ContentValue[];
  tableHeaders: [string | null, string];
};
export const DataTable = ({ data, tableHeaders }: Props) => {
  return (
    <div className="px-2">
      <Table>
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
            <TableRow key={idx} className="h-[38px] border-none odd:bg-[#00000008]">
              {item.value !== null ? (
                <TableCell className="w-20 text-[14px] font-medium">{item.value}</TableCell>
              ) : null}
              {item.content !== null ? (
                <TableCell className="flex items-center whitespace-break-spaces border-none text-[14px] font-medium">
                  {item.content}
                  <CopyToClipboardButton
                    sizeVariant="icon-xs"
                    variant="ghost"
                    onCopy={() => handleCopyClick(item.content.toString())}
                  />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
