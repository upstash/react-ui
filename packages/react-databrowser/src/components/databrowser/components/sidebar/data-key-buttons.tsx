import { Button } from "@/components/ui/button";
import { RedisTypeTag } from "@/components/databrowser/type-tag";
import { useDatabrowserStore } from "@/store";
import { useKeys } from "../../hooks/useKeys";

export const KeysList = () => {
  const { selectedKey, setSelectedKey } = useDatabrowserStore();
  const { keys } = useKeys();

  return (
    <>
      {keys.map(([dataKey, dataType], index) => {
        const isSelected = selectedKey === dataKey;
        return (
          <Button
            key={dataKey}
            className="flex w-full items-center justify-start gap-[8px]"
            variant={isSelected ? "default" : "ghost"}
            onClick={() => setSelectedKey(dataKey)}
            style={isSelected ? { boxShadow: "0px 1px 2px 0px #0000001A" } : {}}
          >
            <RedisTypeTag type={dataType} isIcon />
            <p className="truncate whitespace-nowrap text-left text-[14px] font-medium text-[#000000]">{dataKey}</p>
          </Button>
        );
      })}
    </>
  );
};
