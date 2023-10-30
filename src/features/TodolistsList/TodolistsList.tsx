import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from '../../app/store'
import { changeTodolistFilter, FilterValuesType, TodolistDomainType, todosThunks } from './todolists-reducer'
import { TasksStateType, tasksThunk } from './tasks-reducer'
import { TaskStatuses } from '../../api/todolists-api'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../../components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { isLoggedInSelector } from '../../app/app-selector'
import { tasksSelector, todolistsSelector } from './todolist-selector'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(todolistsSelector)
  const tasks = useSelector<AppRootStateType, TasksStateType>(tasksSelector)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(isLoggedInSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(todosThunks.fetchTodos())
  }, [])

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    const thunk = tasksThunk.removeTask({ taskId, todolistId })
    dispatch(thunk)
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunk.addTask({ title, todolistId }))
  }, [])

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(tasksThunk.updateTask({ taskId, domainModel: { status }, todolistId }))
  }, [])

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    dispatch(tasksThunk.updateTask({ taskId, domainModel: { title }, todolistId }))
  }, [])

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    const action = changeTodolistFilter({ id: todolistId, filter: value })
    dispatch(action)
  }, [])

  const removeTodolist = useCallback(function (todolistId: string) {
    dispatch(todosThunks.removeTodolist({ todolistId }))
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todosThunks.changeTodolistTitle({ id, title }))
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todosThunks.addTodolist({ title }))
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
