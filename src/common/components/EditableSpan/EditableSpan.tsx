import React, { ChangeEvent, FC, useState } from 'react'
import { TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { errorSelector } from '../../../app/appSelector'

type Props = {
  value: string
  onChange: (newValue: string) => void
  addItem?: (title: string) => Promise<any>
}

export const EditableSpan: FC<Props> = React.memo(function ({ value, onChange, addItem }) {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const errorSpan = useSelector(errorSelector)

  const addItemHandler = () => {
    if (addItem && title.trim() !== '') {
      addItem(title)
        .then(() => {
          setTitle('')
        })
        .catch(() => {
          errorSpan ? setError(errorSpan) : setError('An error occurred')
        })
    } else {
      setError('Title is required')
    }
  }

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(value)
  }
  const activateViewMode = () => {
    setEditMode(false)
    onChange(title)
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode ? (
    <TextField
      value={title}
      onChange={changeTitle}
      autoFocus
      onBlur={activateViewMode}
      helperText={error}
      error={!!error}
    />
  ) : (
    <span onDoubleClick={activateEditMode}>{value}</span>
  )
})
