import { useEffect } from "react"
import type { SimpleDataType } from "@/types"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { useFetchSimpleKey } from "../../hooks/use-fetch-simple-key"
import { useSetSimpleKey } from "../../hooks/use-set-simple-key"
import { DisplayHeader } from "./display-header"
import { useField } from "./input/use-field"

export const EditorDisplay = ({ dataKey, type }: { dataKey: string; type: SimpleDataType }) => {
  const { data } = useFetchSimpleKey(dataKey, type)

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <DisplayHeader dataKey={dataKey} type={type} content={data ?? undefined} />

      <div
        className="flex h-full grow flex-col gap-2
      rounded-md bg-zinc-100 p-3"
      >
        {data === undefined ? (
          <Spinner isLoadingText={""} isLoading={true} />
        ) : data === null ? (
          <></>
        ) : (
          <EditorDisplayForm key={dataKey} dataKey={dataKey} type={type} data={data} />
        )}
      </div>
    </div>
  )
}

const EditorDisplayForm = ({
  dataKey,
  type,
  data,
}: {
  dataKey: string
  type: SimpleDataType
  data: string
}) => {
  const form = useForm({
    defaultValues: { value: data },
  })
  const { editor, selector } = useField({ name: "value", form })

  const { mutateAsync: setKey, isPending: isSettingKey } = useSetSimpleKey(dataKey, type)

  // Updates default values after submit
  useEffect(() => {
    form.reset(
      { value: data },
      {
        keepValues: true,
      }
    )
  }, [data])

  const handleCancel = () => {
    form.reset()
  }

  return (
    <>
      <div className="flex grow flex-col gap-1">
        <div className="flex shrink-0 items-center gap-2">
          {type === "json" ? <div /> : selector}
        </div>

        <div className="grow rounded-md border border-zinc-300 bg-white p-1">{editor}</div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="ml-auto flex gap-2">
          {form.formState.isDirty && <Button onClick={handleCancel}>Cancel</Button>}

          <Button
            variant="primary"
            onClick={form.handleSubmit(async ({ value }) => {
              await setKey(value)
            })}
            disabled={!form.formState.isValid || !form.formState.isDirty}
          >
            <Spinner isLoading={isSettingKey} isLoadingText={"Saving"}>
              Save
            </Spinner>
          </Button>
        </div>
      </div>
    </>
  )
}
