import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { AnyAction } from 'redux'
import { todosThunks } from '../features/TodolistsList/model/todolists/todolists.reducer'

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
      .addMatcher(isPending, (state) => {
        state.status = 'loading'
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.status = 'failed'
        if (action.payload) {
          if (action.type === todosThunks.addTodolist.rejected.type) return
          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
      })
  },
})

export const appReducer = slice.reducer

export const { setAppError, isAppInitialized } = slice.actions
