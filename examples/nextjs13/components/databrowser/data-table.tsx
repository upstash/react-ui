import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navigation, ScoredContent } from "./hooks/useFetchSingleDataByKey";
import { Button } from "../ui/button";

type Props = {
  data: ScoredContent[];
  navigation: Navigation;
  tableHeaders: [string, string];
};
export const DataTable = ({ data, navigation, tableHeaders }: Props) => {
  return (
    <div>
      <Table className="my-4 p-4 min-h-[325px]  rounded-md border border-dashed">
        <TableCaption>
          <div className="flex items-center justify-between">
            <span>A list of your sorted sets</span>
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
              <TableCell className="font-medium">{item.score}</TableCell>
              <TableCell className="font-medium">{item.content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
