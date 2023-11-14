import { tasksReducer } from '../features/TodolistsList/tasksReducer'
import { todolistsReducer } from '../features/TodolistsList/todolistsReducer'
import { AnyAction, combineReducers } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appReducer } from './appReducer'
import { authReducer } from '../features/Login/authReducer'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

/**
 * обращаемся в консоли к store в любой момент
 */

// @ts-ignore
window.store = store
