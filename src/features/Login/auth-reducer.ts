import { Dispatch } from "redux"
import { SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from "../../app/app-reducer"
import { authAPI, LoginParamsType } from "../../api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "../../app/store"

// slice - редьюсеры создаем с помощью функции createSlice
const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  // состоит из подредьюсеров, каждый из которых эквивалентен одному оператору case в switch, как делала раньше (обычный redux)
  reducers: {
    // Объект payload. Типизация через PayloadAction
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      // логику в подредьюсерах пишем мутабельным образом, т.к. иммутабельность достигается благодаря immer.js
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
})

// Создаем reducer с помощью slice
export const authReducer = slice.reducer

// Action creator также достаем с помощью slice
export const { setIsLoggedIn } = slice.actions

// можно достать и так
// export const authAction = slice.actions;

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const logoutTC = (): AppThunk => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
