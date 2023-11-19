import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialState = ReturnType<typeof slice.getInitialState>

/**
 * @name initialState
 * @param status - происходит ли сейчас взаимодействие с сервером
 * @param isInitialized - для записи глобальной ошибки
 * @param isInitialized true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
 */

/**
 * addMatcher
 * {@link https://redux-toolkit.js.org/api/createReducer#builderaddmatcher}
 */

const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatus,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    isAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.endsWith('/pending')
        },
        (state, action) => {
          state.status = 'loading'
        },
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith('/fulfilled')
        },
        (state, action) => {
          state.status = 'idle'
        },
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith('/rejected')
        },
        (state, action) => {
          state.status = 'idle'
        },
      )
  },
})

export const appReducer = slice.reducer

export const { setAppError, isAppInitialized } = slice.actions
