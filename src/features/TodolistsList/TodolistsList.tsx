import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from '../../app/store'
import { changeTodolistFilter, FilterValuesType, TodolistDomainType, todosThunks } from './todolists-reducer'
import { TasksStateType, tasksThunk } from './tasks-reducer'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../../common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from '../../common/hooks/useAppDispatch'
import { tasksSelector, todolistsSelector } from './todolist-selector'
import { TaskStatuses } from '../../common/enums/enums'
import { isLoggedInSelector } from '../Login/auth-selector'
import { useActions } from '../../common/hooks/useActions'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(todolistsSelector)
  const tasks = useSelector<AppRootStateType, TasksStateType>(tasksSelector)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(isLoggedInSelector)

  const dispatch = useAppDispatch()

  const actions = useActions({ ...todosThunks, ...tasksThunk })

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    actions.fetchTodos()
  }, [])

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    actions.removeTask({ taskId, todolistId })
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    actions.addTask({ title, todolistId })
  }, [])

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    actions.updateTask({ taskId, domainModel: { status }, todolistId })
  }, [])

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    actions.updateTask({ taskId, domainModel: { title }, todolistId })
  }, [])

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    dispatch(changeTodolistFilter({ id: todolistId, filter: value }))
  }, [])

  const removeTodolist = useCallback(function (todolistId: string) {
    actions.removeTodolist({ todolistId })
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    actions.changeTodolistTitle({ id, title })
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      actions.addTodolist({ title })
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
