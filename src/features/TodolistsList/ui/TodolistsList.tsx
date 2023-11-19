import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootState } from '../../../app/store'
import { TodolistDomain, todosThunks } from '../model/todolists/todolists.reducer'
import { tasksThunk } from '../model/Task/tasks.reducer'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../../../common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { todolistsSelector } from '../model/todolists/todolistSelector'
import { isLoggedInSelector } from '../../Login/authSelector'
import { useActions } from '../../../common/hooks/useActions'

type Props = {
  demo?: boolean
}

export const TodolistsList: React.FC<Props> = ({ demo = false }) => {
  const todolists = useSelector<AppRootState, Array<TodolistDomain>>(todolistsSelector)
  const isLoggedIn = useSelector<AppRootState, boolean>(isLoggedInSelector)

  const actions = useActions({ ...todosThunks, ...tasksThunk })

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    actions.fetchTodos()
  }, [])

  const addTodolist = useCallback((title: string) => {
    return actions.addTodolist({ title }).unwrap()
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
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <Todolist todolist={tl} demo={demo} addItem={addTodolist} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
