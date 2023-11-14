import { tasksReducer } from '../features/TodolistsList/model/Task/tasks.reducer'
import { todolistsReducer } from '../features/TodolistsList/model/todolists/todolists.reducer'
import { AnyAction, combineReducers } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appReducer } from './app.reducer'
import { authReducer } from '../features/Login/auth.reducer'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})

export type AppRootState = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<AppRootState, unknown, AnyAction>

/**
 * обращаемся в консоли к store в любой момент
 */

// @ts-ignore
window.store = store
