import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { DataType } from "@/types";
import { useEffect } from "react";
import { useFetchSimpleKey } from "../../hooks/use-fetch-simple-key";
import { useSetSimpleKey } from "../../hooks/use-set-simple-key";
import { DisplayHeader } from "./display-header";
import { useField } from "./input/use-field";
import { useForm } from "react-hook-form";

export const EditorDisplay = ({ dataKey, type }: { dataKey: string; type: DataType }) => {
  const { data } = useFetchSimpleKey(dataKey, type);

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-scroll">
      <DisplayHeader dataKey={dataKey} type={type} size={10000} length={1234} />
      {data === undefined ? (
        <>Loading...</>
      ) : data === null ? (
        <>Missing key</>
      ) : (
        <EditorDisplayForm key={dataKey} dataKey={dataKey} type={type} data={data} />
      )}
    </div>
  );
};

const EditorDisplayForm = ({ dataKey, type, data }: { dataKey: string; type: DataType; data: string }) => {
  const form = useForm({
    defaultValues: { value: data },
  });
  const { editor, selector } = useField({ name: "value", form });

  const { mutateAsync: setKey, isPending: isSettingKey } = useSetSimpleKey(dataKey, type);

  // Updates default values after submit
  useEffect(() => {
    form.reset(
      { value: data },
      {
        keepValues: true,
      },
    );
  }, [data]);

  const handleCancel = () => {
    form.reset();
  };

  return (
    <>
      <div className="flex-grow rounded-md border border-zinc-300 bg-white p-1">{editor}</div>
      <div className="flex flex-shrink-0 justify-between px-3 pb-2 pt-1">
        {selector}

        {form.formState.isDirty && (
          <div className="flex gap-1">
            <Button
              onClick={handleCancel}
              className="h-6 rounded-md border bg-white px-3 font-normal text-zinc-700 hover:bg-zinc-100"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(async ({ value }) => {
                await setKey(value);
              })}
              className={cn(
                "h-6 rounded-md bg-emerald-500 px-3 font-normal text-white hover:bg-emerald-600 disabled:opacity-50",
              )}
              disabled={!form.formState.isValid}
            >
              <Spinner isLoading={isSettingKey} isLoadingText={"Saving"}>
                Save
              </Spinner>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
