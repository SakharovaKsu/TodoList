import { createSlice } from '@reduxjs/toolkit'
import { isAppInitialized } from '../../app/app.reducer'
import { clearTodoData } from '../TodolistsList/model/todolists/todolists.reducer'
import { handleServerAppError } from '../../common/utils/handleServerAppError'
import { authApi, LoginParams } from './auth.api'
import { resultCode } from '../../common/resultCode/resultCode'
import { createAppAsyncThunk } from '../../common/utils/createAppAsyncThunk'
import { thunkTryCatch } from '../../common/utils/thunkTryCatch'

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

export const authReducer = slice.reducer

export const login = createAppAsyncThunk<void, LoginParams>('auth/login', async (arg, thunkAPI) => {
  const res = await authApi.login(arg)
  if (res.data.resultCode === resultCode.success) {
    return undefined
  }
  return thunkAPI.rejectWithValue(res.data)
})

export const logout = createAppAsyncThunk<void, void>('auth/logout', async (_, thunkAPI) => {
  const res = await authApi.logout()

  if (res.data.resultCode === resultCode.success) {
    thunkAPI.dispatch(clearTodoData())
    return undefined
  }
})

export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  'auth/initializeApp',
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authApi.me()
      if (res.data.resultCode === resultCode.success) {
        return { isLoggedIn: true }
      } else {
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(isAppInitialized({ isInitialized: true }))
    })
  },
)

export const authThunks = { login, logout, initializeApp }
