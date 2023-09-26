import { Button } from "@/components/ui/button";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { TTLDialog } from "../ttl-dialog";

export const DataDisplayHeader = () => {
  return (
    <div className="flex items-center space-between">
      <TTLDialog>
        <Button variant="outline" className="text-sm border-dashed">
          TTL: 81764974s
        </Button>
      </TTLDialog>
      <div className="ml-auto mr-4">
        <Button>
          <MinusCircledIcon className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};
