import { Dispatch } from 'redux'
import { setAppError, setAppStatus } from '../../app/app-reducer'
import { BaseResponseType } from './../types/index'

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }))
  } else {
    dispatch(setAppError({ error: 'Some error occurred' }))
  }
  dispatch(setAppStatus({ status: 'failed' }))
}
