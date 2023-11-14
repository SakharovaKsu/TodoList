import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { AppDispatch, AppRootState } from '../../app/store'
import { BaseResponse } from '../types'
import { handleServerNetworkError } from './handleServerNetworkError'
import { setAppStatus } from '../../app/app.reducer'

/**
 * thunkTryCatch - брабатывает асинхронную логику, обновляет статус приложения и обрабатывает ошибки в случае неудачи.
 * @param logic Это функция, которая выполняет асинхронную логику (например, сетевой запрос) и возвращает промис с результатом.
 */

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootState, unknown, AppDispatch, null | BaseResponse>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(setAppStatus({ status: 'succeeded' }))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(setAppStatus({ status: 'idle' }))
  }
}
