import { RequestStatusType, setAppStatus } from '../../app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { tasksThunk } from './tasks-reducer'
import { createAppAsyncThunk } from '../../common/utils/createAppAsyncThunk'
import { todolistAPI, TodolistType } from './todolists-api'
import { thunkTryCatch } from '../../common/utils/thunkTryCatch'

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
const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  `${slice.name}/fetchTodolists`,
  (_, thunkAPI) => {
    const { dispatch } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.getTodolists()
      res.data.forEach((tl) => {
        dispatch(tasksThunk.fetchTasks(tl.id))
      })

      return { todolists: res.data }
    })
  },
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `${slice.name}/removeTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
      dispatch(changeTodolistEntityStatus({ id: arg.todolistId, status: 'loading' }))
      const res = await todolistAPI.deleteTodolist(arg.todolistId)
      return arg
    })
  },
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  `${slice.name}/addTodolist`,
  async (arg, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.createTodolist(arg.title)
      return { todolist: res.data.data.item }
    })
  },
)

const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  `${slice.name}/changeTodolistTitle`,
  async (arg, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.updateTodolist(arg.id, arg.title)
      return { id: arg.id, title: arg.title }
    })
  },
)

export const todosThunks = { fetchTodos, removeTodolist, addTodolist, changeTodolistTitle }

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
