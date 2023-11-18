import React from 'react'
import { AddItemForm } from '../../../../common/components/AddItemForm/AddItemForm'
import { TodolistDomain } from '../../model/todolists/todolists.reducer'
import { useActions } from '../../../../common/hooks/useActions'
import { tasksThunk } from '../../model/Task/tasks.reducer'
import FilterTasksButtons from './Tasks/Task/FilterTasksButtons'
import Tasks from './Tasks/Tasks'
import TodolistTitle from './TodolistTitle/TodolistTitle'

type Props = {
  todolist: TodolistDomain
  demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, todolist }: Props) {
  const { addTask } = useActions(tasksThunk)
  const todolistId = todolist.id

  const addTaskHandler = (title: string) => {
    addTask({ title, todolistId })
  }

  return (
    <div>
      <TodolistTitle
        title={todolist.title}
        todolistId={todolist.id}
        disabledButton={todolist.entityStatus === 'loading'}
      />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === 'loading'} />
      <Tasks todolist={todolist} />
      <FilterTasksButtons todolist={todolist} />
    </div>
  )
})
