import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, AppRootState } from '../../app/store'
import { BaseResponse } from '../types'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
  rejectValue: BaseResponse | null
}>()
