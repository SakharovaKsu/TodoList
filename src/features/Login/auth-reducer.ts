import { handleServerNetworkError } from '../../common/utils/handleServerNetworkError'
import { createSlice } from '@reduxjs/toolkit'
import { appReducer, isAppInitialized, setAppStatus } from '../../app/app-reducer'
import { clearTodoData } from '../TodolistsList/todolists-reducer'
import { handleServerAppError } from '../../common/utils/handleServerAppError'
import { authAPI, LoginParamsType } from './auth-api'
import { resultCode } from '../../common/resultCode/resultCode'
import { createAppAsyncThunk } from '../../common/utils/createAppAsyncThunk'

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
      .addCase(initializeApp.fulfilled, (state) => {
        state.isLoggedIn = true
      })
  },
})

// Создаем reducer с помощью slice
export const authReducer = slice.reducer

export const login = createAppAsyncThunk<void, LoginParamsType>('auth/login', async (arg, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await authAPI.login(arg)

    if (res.data.resultCode === resultCode.success) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      return undefined
    }
    handleServerAppError(res.data, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue(null)
  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue(null)
  }
})

export const logout = createAppAsyncThunk<void, void>('auth/logout', async (_, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await authAPI.logout()

    if (res.data.resultCode === resultCode.success) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      thunkAPI.dispatch(clearTodoData())
      return undefined
    }
  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue(null)
  }
})

export const initializeApp = createAppAsyncThunk<void, void>('auth/initializeApp', async (_, thunkAPI) => {
  const res = await authAPI.me()

  try {
    if (res.data.resultCode === resultCode.success) {
      return undefined
    }
  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue(null)
  } finally {
    thunkAPI.dispatch(isAppInitialized({ isInitialized: true }))
  }
})
