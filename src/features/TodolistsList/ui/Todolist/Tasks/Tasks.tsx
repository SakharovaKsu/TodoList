import React, { FC } from 'react'
import { Task } from './Task/Task'
import { TaskType } from '../../../api/tasks/tasks.types'
import { TaskStatuses } from '../../../../../common/enums/enums'
import { TodolistDomain } from '../../../model/todolists/todolists.reducer'
import { useSelector } from 'react-redux'
import { AppRootState } from '../../../../../app/store'
import { TasksState } from '../../../model/Task/tasks.reducer'
import { tasksSelector } from '../../../model/todolists/todolistSelector'

type Props = {
  todolist: TodolistDomain
}

const Tasks: FC<Props> = ({ todolist }) => {
  const allTasks = useSelector<AppRootState, TasksState>(tasksSelector)
  const tasks = allTasks[todolist.id]
  let tasksForTodolist = tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return <div>{tasksForTodolist?.map((t) => <Task key={t.id} task={t} todolistId={todolist.id} />)}</div>
}

export default Tasks
