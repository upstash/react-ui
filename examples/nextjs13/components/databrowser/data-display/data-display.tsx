import { Badge } from "../../ui/badge";
import { ScrollArea } from "../../ui/scroll-area";

export function DataDisplay() {
  return (
    <div className="h-full flex-col border-none p-0 data-[state=active]:flex">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">0pVPr:55TKNa</h2>
            <Badge
              variant="secondary"
              className="text-white bg-green-500 rounded pointer-events-none"
            >
              String
            </Badge>
          </div>
          <p className="text-lg font-medium text-muted-foreground">Content</p>
        </div>
      </div>
      <ScrollArea className="my-4 p-4 flex h-[350px] shrink-0 items-center justify-center rounded-md border border-dashed">
        Jokester began sneaking into the castle in the middle of the night and leaving jokes all
        over the place: under the king's pillow, in his soup, even in the royal toilet. The king was
        furious, but he couldn't seem to stop Jokester. And then, one day, the people of the kingdom
        discovered that the jokes left by Jokester were so funny that they couldn't help but laugh.
        And once they started laughing, they couldn't stop.
      </ScrollArea>
    </div>
  );
}
