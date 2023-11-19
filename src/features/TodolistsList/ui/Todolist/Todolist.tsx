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
  addItem: (title: string) => Promise<any>
}

export const Todolist = React.memo(function ({ demo = false, todolist, addItem }: Props) {
  const { addTask } = useActions(tasksThunk)
  const todolistId = todolist.id

  const addTaskHandler = (title: string) => {
    return addTask({ title, todolistId }).unwrap()
  }

  return (
    <div>
      <TodolistTitle
        titleTodo={todolist.title}
        todolistId={todolist.id}
        disabledButton={todolist.entityStatus === 'loading'}
        addItem={addItem}
      />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === 'loading'} />
      <Tasks todolist={todolist} />
      <FilterTasksButtons todolist={todolist} />
    </div>
  )
})
