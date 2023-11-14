import React, { useCallback } from 'react'
import { AddItemForm } from '../../../../common/components/AddItemForm/AddItemForm'
import { EditableSpan } from '../../../../common/components/EditableSpan/EditableSpan'
import { Task } from '../Task/Task'
import { changeTodolistFilter, TodolistDomainType, todosThunks } from '../../model/todolists/todolists.reducer'
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { TaskStatuses } from '../../../../common/enums/enums'
import { TaskType } from '../../api/tasks/tasks.types'
import { useActions } from '../../../../common/hooks/useActions'
import { useAppDispatch } from '../../../../common/hooks/useAppDispatch'

type TodolistType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
  addTask: (title: string, todolistId: string) => void
  demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, todolist, ...props }: TodolistType) {
  const dispatch = useAppDispatch()
  const { removeTodolist, changeTodolistTitle } = useActions(todosThunks)
  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, todolist.id)
    },
    [props.addTask, todolist.id],
  )

  const removeTodolistHandler = () => {
    removeTodolist({ todolistId: todolist.id })
  }
  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: todolist.id, title })
    },
    [todolist.id, changeTodolistTitle],
  )

  const onAllClickHandler = useCallback(
    () => dispatch(changeTodolistFilter({ id: todolist.id, filter: 'all' })),
    [todolist.id, changeTodolistFilter],
  )
  const onActiveClickHandler = useCallback(
    () => dispatch(changeTodolistFilter({ id: todolist.id, filter: 'active' })),
    [todolist.id, changeTodolistFilter],
  )
  const onCompletedClickHandler = useCallback(
    () => dispatch(changeTodolistFilter({ id: todolist.id, filter: 'completed' })),
    [todolist.id, changeTodolistFilter],
  )

  let tasksForTodolist = props.tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={todolist.entityStatus === 'loading'} />
      <div>{tasksForTodolist?.map((t) => <Task key={t.id} task={t} todolistId={todolist.id} />)}</div>
      <div style={{ paddingTop: '10px' }}>
        <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'} onClick={onAllClickHandler} color={'inherit'}>
          All
        </Button>
        <Button
          variant={todolist.filter === 'active' ? 'outlined' : 'text'}
          onClick={onActiveClickHandler}
          color={'primary'}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
          onClick={onCompletedClickHandler}
          color={'secondary'}
        >
          Completed
        </Button>
      </div>
    </div>
  )
})
