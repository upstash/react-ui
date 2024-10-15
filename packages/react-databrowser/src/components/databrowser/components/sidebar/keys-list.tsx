import { Button } from "@/components/ui/button";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { useDatabrowserStore } from "@/store";
import { useKeys } from "../../hooks/use-keys";
import { cn } from "@/lib/utils";

export const KeysList = () => {
  const { selectedKey, setSelectedKey } = useDatabrowserStore();
  const { keys } = useKeys();

  return (
    <>
      {keys.map(([dataKey, dataType]) => {
        const isSelected = selectedKey === dataKey;
        return (
          <Button
            key={dataKey}
            className={cn(
              "flex w-full items-center justify-start gap-[8px] border",
              isSelected ? "border-emerald-400 bg-emerald-50 shadow-sm hover:bg-emerald-100/60" : "border-transparent",
            )}
            variant={isSelected ? "default" : "ghost"}
            onClick={() => setSelectedKey(dataKey)}
          >
            <RedisTypeTag type={dataType} isIcon />
            <p className="truncate whitespace-nowrap text-left text-[14px] font-medium text-[#000000]">{dataKey}</p>
          </Button>
        );
      })}
    </>
  );
};
