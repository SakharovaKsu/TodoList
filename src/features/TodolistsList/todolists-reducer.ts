import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { RequestStatusType, setAppStatus } from '../../app/app-reducer'
import { handleServerNetworkError } from '../../utils/error-utils'
import { AppThunk } from '../../app/store'
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { fetchTasksTC } from './tasks-reducer'

const initialState: TodolistDomainType[] = []

const slice = createSlice({
  name: 'todolist',
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      // splice - первое значение - индекс элемента, второе значение - количество элементов, которое хочу удалить
      // но сначала ищем индекс и если находится, то уже удаляем в splice
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state.splice(index, 1)
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      // console.log(current(state)) добавляем current, что б посмотреть что находится в стейте
      // добавляем в начало
      state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      // находим индекс массивы, которому нужно изменить title и через state[index].title уже добавляем измененный title
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].title = action.payload.title
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].entityStatus = action.payload.status
    },
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      // памятка: state = action.payload.todolists - так писать НЕЛЬЗЯ!
      return action.payload.todolists.map((todolist) => ({ ...todolist, filter: 'all', entityStatus: 'idle' }))
    },
    clearTodoData: (state, action: PayloadAction) => {
      state.splice(0)
    },
  },
})

export const todolistsReducer = slice.reducer
export const {
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
  changeTodolistFilter,
  changeTodolistEntityStatus,
  setTodolists,
  clearTodoData,
} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus({ status: 'loading' }))
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolists({ todolists: res.data }))
        dispatch(setAppStatus({ status: 'succeeded' }))
        return res.data
      })
      .then((todos) => {
        todos.forEach((tl) => {
          dispatch(fetchTasksTC(tl.id))
        })
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatus({ status: 'loading' }))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({ id: todolistId, status: 'loading' }))
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolist({ id: todolistId }))
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(setAppStatus({ status: 'succeeded' }))
    })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: 'loading' }))
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolist({ todolist: res.data.data.item }))
      dispatch(setAppStatus({ status: 'succeeded' }))
    })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitle({ id: id, title: title }))
    })
  }
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
