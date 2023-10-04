import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navigation, ContentValue } from "@/components/databrowser/hooks/useFetchSingleDataByKey";
import { Button } from "@/components/ui/button";
import { CopyToClipboardButton, handleCopyClick } from "@/components/databrowser/copy-to-clipboard-button";

type Props = {
  data: ContentValue[];
  navigation: Navigation;
  tableHeaders: [string | null, string];
};
export const DataTable = ({ data, navigation, tableHeaders }: Props) => {
  return (
    <div>
      <Table className="my-4 rounded-md border border-dashed p-4 tracking-wide">
        <TableCaption>
          <div className="flex items-center justify-end">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigation.handlePageChange("prev")}
                disabled={navigation.prevNotAllowed}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigation.handlePageChange("next")}
                disabled={navigation.nextNotAllowed}
              >
                Next
              </Button>
            </div>
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow>
            {tableHeaders[0] !== null ? <TableHead className="w-[100px]">{tableHeaders[0]}</TableHead> : null}
            {tableHeaders[1] !== null ? <TableHead className="w-[100px]">{tableHeaders[1]}</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx}>
              {item.value !== null ? <TableCell className="text-[12px] font-medium">{item.value}</TableCell> : null}
              {item.content !== null ? (
                <TableCell className="flex w-full justify-between text-[12px] font-medium">
                  {item.content}
                  <CopyToClipboardButton
                    sizeVariant="icon-xs"
                    variant="ghost"
                    onCopy={() => handleCopyClick(`${item.value ? `${item.value}:` : ""}${item.content}`)}
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
