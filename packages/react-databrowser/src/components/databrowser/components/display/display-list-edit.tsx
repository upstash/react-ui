import { useDatabrowserStore } from "@/store"
import type { ListDataType } from "@/types"
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SimpleTooltip } from "@/components/ui/tooltip"

import { useEditListItem } from "../../hooks/use-edit-list-item"
import { headerLabels } from "./display-list"
import { useField } from "./input/use-field"

export const ListEditDisplay = ({ dataKey, type }: { dataKey: string; type: ListDataType }) => {
  const { selectedListItem } = useDatabrowserStore()

  if (!selectedListItem) {
    return <></>
  }

  return (
    <div className="grow rounded-md bg-zinc-100 p-3">
      <ListEditForm
        key={selectedListItem.key}
        item={selectedListItem}
        type={type}
        dataKey={dataKey}
      />
    </div>
  )
}

const ListEditForm = ({
  type,
  dataKey,
  item: { key: itemKey, value: itemValue, isNew },
}: {
  type: ListDataType
  dataKey: string
  item: { key: string; value?: string; isNew?: boolean }
}) => {
  const form = useForm({
    defaultValues: {
      key: itemKey,
      value: itemValue,
    },
  })

  const { mutateAsync: editItem, isPending } = useEditListItem()
  const { setSelectedListItem } = useDatabrowserStore()

  const [keyLabel, valueLabel] = headerLabels[type]

  const onSubmit = form.handleSubmit(async ({ key, value }) => {
    await editItem({
      type: type,
      dataKey,
      itemKey,
      newKey: key,
      newValue: value,
      isNew: isNew,
    })
    setSelectedListItem(undefined)
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex grow flex-col gap-2">
          {type !== "list" && <FormItem name="key" label={keyLabel} />}

          {type === "zset" ? (
            <NumberFormItem name="value" label={valueLabel} />
          ) : (
            type !== "set" && <FormItem name="value" label={valueLabel} />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              setSelectedListItem(undefined)
            }}
          >
            Cancel
          </Button>
          <SimpleTooltip
            content={type === "stream" && !isNew ? "Streams are not mutable" : undefined}
          >
            <Button
              variant="primary"
              type="submit"
              disabled={
                !form.formState.isValid || !form.formState.isDirty || (type === "stream" && !isNew)
              }
            >
              <Spinner isLoading={isPending} isLoadingText={"Saving"}>
                Save
              </Spinner>
            </Button>
          </SimpleTooltip>
        </div>
      </form>
    </FormProvider>
  )
}

const NumberFormItem = ({ name, label }: { name: string; label: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex">
        <span className="text-xs font-medium text-zinc-700">{label}</span>
      </div>
      <Controller
        name={name}
        render={({ field }) => (
          <input
            className="plain-input rounded-md border border-zinc-300 px-3 py-1 shadow-sm"
            type="number"
            {...field}
          />
        )}
      />
    </div>
  )
}

const FormItem = ({ name, label }: { name: string; label: string; isNumber?: boolean }) => {
  const form = useFormContext()
  const { editor, selector } = useField({
    name,
    form,
    isEditorDynamic: true,
    showCopyButton: true,
  })

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-xs">
        <span className="font-medium text-zinc-700">{label}</span>{" "}
        <span className="text-zinc-300">/</span>
        {selector}
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-300 bg-white p-2 shadow-sm">
        {editor}
      </div>
    </div>
  )
}
