import { Dispatch } from 'redux'
import { setAppError } from '../../app/app.reducer'
import { BaseResponse } from './../types/index'

/**
 * Данная функция обрабатывает ошибки, которые могут возникнуть при взаимодействии с сервером.
 * @param data  - ответ от сервера в формате ResponseType<D>
 * @param dispatch - функция для отправки сообщений в store Redux
 * @param showError - флаг, указывающий, нужно ли отображать ошибки в пользовательском интерфейсе
 */

export const handleServerAppError = <D>(data: BaseResponse<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(setAppError({ error: data.messages.length ? data.messages[0] : 'Some error occurred' }))
  }
}
