import { Dispatch } from 'redux'
import { authAPI } from '../api/todolists-api'
import { setIsLoggedIn } from '../features/Login/auth-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialState = ReturnType<typeof slice.getInitialState>

const slice = createSlice({
  name: 'app',
  initialState: {
    // происходит ли сейчас взаимодействие с сервером
    status: 'idle' as RequestStatusType,
    // если ошибка какая-то глобальная произойдёт - запишем текст ошибки сюда
    error: null as string | null,
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: false,
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    isAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

// Создаем reducer с помощью slice
export const appReducer = slice.reducer

// Action creator также достаем с помощью slice
export const { setAppStatus, setAppError, isAppInitialized } = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }))
    } else {
    }

    dispatch(isAppInitialized({ isInitialized: true }))
  })
}
