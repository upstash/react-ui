import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navigation, ContentValue } from "./hooks/useFetchSingleDataByKey";
import { Button } from "../ui/button";

type Props = {
  data: ContentValue[];
  navigation: Navigation;
  tableHeaders: [string, string];
};
export const DataTable = ({ data, navigation, tableHeaders }: Props) => {
  return (
    <div>
      <Table className="p-4 my-4 border border-dashed rounded-md">
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
            <TableHead className="w-[100px]">{tableHeaders[0]}</TableHead>
            <TableHead className="w-[100px]">{tableHeaders[1]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{item.value}</TableCell>
              <TableCell className="font-medium">{item.content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
