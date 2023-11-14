import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from '../../../app/store'
import { TodolistDomainType, todosThunks } from '../model/todolists/todolists.reducer'
import { TasksStateType, tasksThunk } from '../model/Task/tasks.reducer'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../../../common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { tasksSelector, todolistsSelector } from '../model/todolists/todolistSelector'
import { isLoggedInSelector } from '../../Login/authSelector'
import { useActions } from '../../../common/hooks/useActions'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(todolistsSelector)
  const tasks = useSelector<AppRootStateType, TasksStateType>(tasksSelector)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(isLoggedInSelector)

  const actions = useActions({ ...todosThunks, ...tasksThunk })

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    actions.fetchTodos()
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    actions.addTask({ title, todolistId })
  }, [])

  const addTodolist = useCallback((title: string) => {
    actions.addTodolist({ title })
  }, [])

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
                <Todolist todolist={tl} tasks={allTodolistTasks} addTask={addTask} demo={demo} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
