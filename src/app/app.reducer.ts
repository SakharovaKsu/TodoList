import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialState = ReturnType<typeof slice.getInitialState>

/**
 * initialState в app
 * @param status - происходит ли сейчас взаимодействие с сервером
 * @param isInitialized - для записи глобальной ошибки
 * @param isInitialized true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
 */

const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatus,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatus }>) => {
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

export const appReducer = slice.reducer

export const { setAppStatus, setAppError, isAppInitialized } = slice.actions
