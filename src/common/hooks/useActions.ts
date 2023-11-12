import { useMemo } from 'react'
import { ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { useAppDispatch } from './useAppDispatch'

/**
 * @param useActions - облегчает связывание действий Redux с диспатчем в компонентах и обеспечивает типизацию возвращаемых значений для каждого действия.
 */

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
  const dispatch = useAppDispatch()

  return useMemo(() => bindActionCreators<T, RemapActionCreators<T>>(actions, dispatch), [actions, dispatch])
}

/**
 * @param IsValidArg - Проверяет, является ли T объектом (object) и имеет ли он хотя бы одно свойство. Если это так, возвращается true, иначе false.
 * @param ActionCreatorResponse<T>: Получает тип возвращаемого значения при вызове действия T.
 * @param ReplaceReturnType<T, TNewReturn>: Заменяет тип возвращаемого значения функции T на тип TNewReturn.
 */

// Types
type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true
type ActionCreatorResponse<T extends (...args: any[]) => any> = ReturnType<ReturnType<T>>
type ReplaceReturnType<T, TNewReturn> = T extends (...args: any[]) => infer R
  ? IsValidArg<Extract<T, (...args: any[]) => any>> extends true
    ? (...args: Parameters<Extract<T, (...args: any[]) => any>>) => TNewReturn
    : () => TNewReturn
  : never

/**
 * @param RemapActionCreators<T>: Проходится по каждому свойству T (действию), и для каждого действия обновляет его тип, чтобы функция действия возвращала ActionCreatorResponse<T>.
 */

type RemapActionCreators<T extends ActionCreatorsMapObject> = {
  [K in keyof T]: ReplaceReturnType<T[K], ActionCreatorResponse<T[K]>>
}
