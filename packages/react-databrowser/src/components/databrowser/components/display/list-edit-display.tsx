import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useField } from "./input/use-field";
import { useDatabrowser, useDatabrowserStore } from "@/store";
import { DataType } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";

export const ListEditDisplay = ({ dataKey, type }: { dataKey: string; type: DataType }) => {
  const { selectedListItem } = useDatabrowserStore();

  if (!selectedListItem) return <></>;

  return (
    <div className="rounded-md bg-zinc-100 p-3">
      <ListEditForm
        key={selectedListItem.key}
        itemKey={selectedListItem.key}
        itemValue={selectedListItem.value ?? ""}
        type={type}
        dataKey={dataKey}
      />
    </div>
  );
};

const useEditListItem = () => {
  const { redis } = useDatabrowser();

  return useMutation({
    mutationFn: async ({
      type,
      dataKey,
      itemKey,
      newKey,
      newValue,
    }: {
      type: DataType;
      dataKey: string;
      itemKey: string;
      newKey?: string;
      newValue?: string;
    }) => {
      const pipe = redis.pipeline();
      const shouldDelete = newKey === undefined || newKey !== itemKey;

      if (type === "zset") {
        if (Number.isNaN(Number(newValue))) throw new Error("Value must be a number for zset data type");

        if (shouldDelete) pipe.zrem(dataKey, itemKey);
        pipe.zadd(dataKey, {
          member: newKey,
          score: Number(newValue),
        });
      } else {
        throw new Error("Not implemented");
      }

      await pipe.exec();
    },
  });
};

const ListEditForm = ({
  type,
  dataKey,
  itemKey,
  itemValue,
}: {
  type: DataType;
  dataKey: string;
  itemKey: string;
  itemValue: string;
}) => {
  const form = useForm({
    defaultValues: {
      key: itemKey,
      value: itemValue,
    },
  });

  const { mutateAsync, isPending } = useEditListItem();
  const { setSelectedListItem } = useDatabrowserStore();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(async ({ key, value }) => {
          await mutateAsync({
            type: type,
            dataKey,
            itemKey,
            newKey: key,
            newValue: value,
          });
          setSelectedListItem(undefined);
        })}
        className="flex flex-col gap-2"
      >
        <div className="flex-grow">
          <FormItem name="key" label="Key" />
          <FormItem name="value" label="Value" />
        </div>

        <div className="flex justify-end gap-1">
          <Button
            type="button"
            onClick={() => {
              setSelectedListItem(undefined);
            }}
            className="h-6 rounded-md border bg-white px-3 font-normal text-zinc-700 hover:bg-zinc-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-6 rounded-md bg-emerald-500 px-3 font-normal text-white hover:bg-emerald-600 disabled:opacity-50"
            disabled={!form.formState.isValid || !form.formState.isDirty}
          >
            <Spinner isLoading={isPending} isLoadingText={"Saving"}>
              Save
            </Spinner>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

const FormItem = ({ name, label }: { name: string; label: string }) => {
  const form = useFormContext();
  const { editor, selector } = useField({
    name,
    form,
    isEditorDynamic: true,
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex">
        <span className="font-medium text-zinc-700">{label}</span> <span className="text-zinc-300">/</span>
        {selector}
      </div>
      {editor}
    </div>
  );
};
