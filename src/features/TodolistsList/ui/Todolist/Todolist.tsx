import React, { useCallback } from 'react'
import { AddItemForm } from '../../../../common/components/AddItemForm/AddItemForm'
import { EditableSpan } from '../../../../common/components/EditableSpan/EditableSpan'
import { Task } from '../Task/Task'
import {
  changeTodolistFilter,
  FilterValues,
  TodolistDomain,
  todosThunks,
} from '../../model/todolists/todolists.reducer'
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { TaskStatuses } from '../../../../common/enums/enums'
import { TaskType } from '../../api/tasks/tasks.types'
import { useActions } from '../../../../common/hooks/useActions'
import { useAppDispatch } from '../../../../common/hooks/useAppDispatch'
import { tasksThunk } from '../../model/Task/tasks.reducer'
import FilterTasksButtons from '../Task/FilterTasksButtons'

type TodolistProps = {
  todolist: TodolistDomain
  tasks: TaskType[]
  demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, todolist, tasks }: TodolistProps) {
  const { addTask } = useActions(tasksThunk)
  const { removeTodolist, changeTodolistTitle } = useActions(todosThunks)
  const todolistId = todolist.id

  const addTaskHandler = (title: string) => {
    addTask({ title, todolistId })
  }

  const removeTodolistHandler = () => {
    removeTodolist({ todolistId })
  }

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ todolistId, title })
  }

  let tasksForTodolist = tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === 'loading'} />
      <div>{tasksForTodolist?.map((t) => <Task key={t.id} task={t} todolistId={todolist.id} />)}</div>
      <FilterTasksButtons todolist={todolist} />
    </div>
  )
})
