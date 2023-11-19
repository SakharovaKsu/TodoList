import React, { FC } from 'react'
import { EditableSpan } from '../../../../../common/components/EditableSpan/EditableSpan'
import { IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { todosThunks } from '../../../model/todolists/todolists.reducer'
import { useActions } from '../../../../../common/hooks/useActions'

type Props = {
  titleTodo: string
  todolistId: string
  disabledButton: boolean
  addItem: (title: string) => Promise<any>
}

const TodolistTitle: FC<Props> = ({ titleTodo, disabledButton, todolistId, addItem }) => {
  const { removeTodolist, changeTodolistTitle } = useActions(todosThunks)

  const removeTodolistHandler = () => {
    removeTodolist({ todolistId })
  }

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ todolistId, title })
  }

  return (
    <h3>
      <EditableSpan value={titleTodo} onChange={changeTodolistTitleHandler} addItem={addItem} />
      <IconButton onClick={removeTodolistHandler} disabled={disabledButton}>
        <Delete />
      </IconButton>
    </h3>
  )
}

export default TodolistTitle
