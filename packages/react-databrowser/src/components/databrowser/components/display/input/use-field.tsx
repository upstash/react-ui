import { useEffect, useState } from "react"
import { useController, type UseFormReturn } from "react-hook-form"

import { ContentTypeSelect, type ContentType } from "./content-type-select"
import { CustomEditor } from "./custom-editor"

export const useField = ({
  name,
  form,
  isEditorDynamic = false,
  showCopyButton,
}: {
  name: string
  form: UseFormReturn<any>
  isEditorDynamic?: boolean
  showCopyButton?: boolean
}) => {
  const { field, fieldState } = useController<Record<string, string>>({
    name,
    control: form.control,
  })

  const [contentType, setContentType] = useState<ContentType>(() =>
    checkIsValidJSON(field.value) ? "JSON" : "Text"
  )

  // Attempt to format JSON on initial load
  useEffect(() => {
    if (!checkIsValidJSON(field.value)) {
      return
    }

    form.setValue(name, formatJSON(field.value), {
      shouldDirty: false,
    })
  }, [])

  const handleTypeChange = (type: ContentType) => {
    setContentType(type)
    if (type === "JSON") {
      form.setValue(name, formatJSON(field.value), {
        shouldDirty: false,
      })
    } else {
      if (!fieldState.isDirty) {
        form.resetField(name)
      }
    }
  }

  return {
    selector: (
      <ContentTypeSelect value={contentType} onChange={handleTypeChange} data={field.value} />
    ),
    editor: (
      <>
        <CustomEditor
          language={contentType === "JSON" ? "json" : "plaintext"}
          value={field.value}
          onChange={field.onChange}
          maxDynamicHeight={isEditorDynamic ? 100 : undefined}
          showCopyButton={showCopyButton}
        />
      </>
    ),
  }
}

const formatJSON = (value: string) => JSON.stringify(JSON.parse(value), null, 2)

export const checkIsValidJSON = (value: string) => {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}
