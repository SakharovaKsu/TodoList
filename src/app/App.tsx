import React, { useCallback, useEffect } from 'react'
import { TodolistsList } from '../features/TodolistsList/ui/TodolistsList'
import { ErrorSnackbar } from '../common/components/ErrorSnackbar/ErrorSnackbar'
import { useDispatch, useSelector } from 'react-redux'
import { AppRootState } from './store'
import { RequestStatus } from './app.reducer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material'
import { Menu } from '@mui/icons-material'
import { isInitializedSelector, statusSelector } from './appSelector'
import { isLoggedInSelector } from '../features/Login/authSelector'
import { initializeApp, logout } from '../features/Login/auth.reducer'
import { Login } from '../features/Login/Login'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useActions } from '../common/hooks/useActions'

type AppProps = {
  demo?: boolean
}

function App({ demo = false }: AppProps) {
  const status = useSelector<AppRootState, RequestStatus>(statusSelector)
  const isInitialized = useSelector<AppRootState, boolean>(isInitializedSelector)
  const isLoggedIn = useSelector<AppRootState, boolean>(isLoggedInSelector)
  const dispatch = useDispatch<any>()
  const actions = useActions({ initializeApp })

  useEffect(() => {
    const callBack = bindActionCreators(initializeApp, dispatch)
    callBack()

    actions.initializeApp()
  }, [])

  const logoutHandler = useCallback(() => {
    dispatch(logout())
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === 'loading' && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={'/'} element={<TodolistsList demo={demo} />} />
            <Route path={'/login'} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

export default App
