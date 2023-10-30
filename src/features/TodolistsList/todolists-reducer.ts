import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { RequestStatusType, setAppStatus } from '../../app/app-reducer'
import { handleServerNetworkError } from '../../utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { tasksThunk } from './tasks-reducer'
import { createAppAsyncThunk } from '../../utils/createAppAsyncThunk'

const initialState: TodolistDomainType[] = []

const slice = createSlice({
  name: 'todolist',
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].entityStatus = action.payload.status
    },
    clearTodoData: (state, action: PayloadAction) => {
      state.splice(0)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        // памятка: state = action.payload.todolists - так писать НЕЛЬЗЯ!
        return action.payload.todolists.map((todolist) => ({ ...todolist, filter: 'all', entityStatus: 'idle' }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        // splice - первое значение - индекс элемента, второе значение - количество элементов, которое хочу удалить
        // но сначала ищем индекс и если находится, то уже удаляем в splice
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
        if (index !== -1) state.splice(index, 1)
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        // console.log(current(state)) добавляем current, что б посмотреть что находится в стейте
        // добавляем в начало
        state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        // находим индекс массивы, которому нужно изменить title и через state[index].title уже добавляем измененный title
        const index = state.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) state[index].title = action.payload.title
      })
  },
})

export const todolistsReducer = slice.reducer
export const { changeTodolistFilter, changeTodolistEntityStatus, clearTodoData } = slice.actions

// thunks
const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  `${slice.name}/fetchTodolists`,
  async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    try {
      const res = await todolistsAPI.getTodolists()

      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

      res.data.forEach((tl) => {
        thunkAPI.dispatch(tasksThunk.fetchTasks(tl.id))
      })

      return { todolists: res.data }
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  },
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `${slice.name}/removeTodolist`,
  async (arg, thunkAPI) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    thunkAPI.dispatch(changeTodolistEntityStatus({ id: arg.todolistId, status: 'loading' }))

    try {
      const res = await todolistsAPI.deleteTodolist(arg.todolistId)

      //скажем глобально приложению, что асинхронная операция завершена
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

      return arg
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  },
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  `${slice.name}.addTodolist`,
  async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))

    try {
      const res = await todolistsAPI.createTodolist(arg.title)
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

      return { todolist: res.data.data.item }
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  },
)

const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  `${slice.name}/changeTodolistTitle`,
  async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))

    try {
      const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

      return { id: arg.id, title: arg.title }
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  },
)

export const todosThunks = { fetchTodos, removeTodolist, addTodolist, changeTodolistTitle }

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
