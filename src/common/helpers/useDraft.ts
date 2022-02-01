
import * as _ from 'lodash'
import { useState } from 'react'

interface IDraft<T> {
  draft: T
  hasChanges: boolean

  handleDraftChange: (change: T) => void
  handlePublish: () => void
  handleDiscard: () => void
}

interface IUseDraftProps<T> {
  source: T

  onPublish: (change: T) => void
}

export function useDraft <T>(props: IUseDraftProps<T>): IDraft<T> {
  const [hasChanges, setHasChanges] = useState(false)
  const { onPublish, source } = props
  const [draft, updateDraft] = useState<T>(source)

  const handleDraftChange = (change: T) => {
    setHasChanges(true)
    updateDraft(change)
  }

  const handleDiscard = () => {
    setHasChanges(false)
    updateDraft(source)
  }

  const handlePublish = () => {
    setHasChanges(false)
    onPublish(draft)
  }

  return {
    draft,
    hasChanges,
    handleDraftChange,
    handleDiscard,
    handlePublish,
  }
}