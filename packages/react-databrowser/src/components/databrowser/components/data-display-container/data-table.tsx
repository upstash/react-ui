import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navigation } from "@/components/databrowser/hooks/useFetchSingleDataByKey";
import { Button } from "@/components/ui/button";
import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";
import { ContentValue } from "../../hooks/useFetchSingleDataByKey/utils";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

type Props = {
  data: ContentValue[];
  navigation: Navigation;
  tableHeaders: [string | null, string];
};
export const DataTable = ({ data, navigation, tableHeaders }: Props) => {
  return (
    <div>
      <div className="px-4">
        <Table className="tracking-wide">
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
              <TableRow key={idx} className="border-none odd:bg-[#00000008]">
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
      <div className="px-0">
        <div className="mb-[12px] mt-[25px] h-[1px] w-full bg-[#0000000D]" />
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="outline"
            size="icon"
            className="ml-auto h-8 w-8 disabled:bg-[#0000000D]"
            onClick={() => navigation.handlePageChange("prev")}
            disabled={navigation.prevNotAllowed}
          >
            <ChevronLeftIcon width="20px" height="20px" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 disabled:bg-[#0000000D]"
            onClick={() => navigation.handlePageChange("next")}
            disabled={navigation.nextNotAllowed}
          >
            <ChevronRightIcon width="20px" height="20px" />
          </Button>
        </div>
      </div>
    </div>
  );
};
