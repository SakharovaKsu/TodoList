import { setAppError } from '../../app/app.reducer'
import axios from 'axios'
import { AppDispatch } from '../../app/store'

/**
 * ❗Проверка на наличие axios ошибки
 *  ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
 *  ⏺️ err?.message - например при создании таски в offline режиме
 *  сначала проверяем на наличие нативной ошибки
 *  далле на какой-то непонятный кейс
 */

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = 'Some error occurred'

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(setAppError({ error: errorMessage }))
}
