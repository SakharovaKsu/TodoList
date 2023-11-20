import { RequestStatus } from '../../../../app/app.reducer'
import { createSlice, isPending, PayloadAction } from '@reduxjs/toolkit'
import { tasksThunk } from '../Task/tasks.reducer'
import { createAppAsyncThunk } from '../../../../common/utils/createAppAsyncThunk'
import { todolistAPI } from '../../api/todolists/todolists.api'
import { thunkTryCatch } from '../../../../common/utils/thunkTryCatch'
import { TodolistType } from '../../api/todolists/todolists.types'
import { resultCode } from '../../../../common/resultCode/resultCode'
import { handleServerAppError } from '../../../../common/utils/handleServerAppError'

const slice = createSlice({
  name: 'todolist',
  initialState: [] as TodolistDomain[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string; filter: FilterValues }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatus }>) => {
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
        return action.payload.todolists.map((todolist) => ({ ...todolist, filter: 'all', entityStatus: 'idle' }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
        if (index !== -1) state.splice(index, 1)
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
        if (index !== -1) state[index].title = action.payload.title
      })
  },
})

export const todolistsReducer = slice.reducer
export const { changeTodolistFilter, changeTodolistEntityStatus, clearTodoData } = slice.actions

// thunks

const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }, void>('todo/fetchTodolists', async () => {
  const res = await todolistAPI.getTodolists()
  return { todolists: res.data }
})

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `${slice.name}/removeTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(changeTodolistEntityStatus({ id: arg.todolistId, status: 'loading' }))
      const res = await todolistAPI.deleteTodolist(arg.todolistId)
      if (res.data.resultCode === resultCode.success) {
        return arg
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
      }
    })
  },
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  'todo/addTodolist',
  async ({ title }, { rejectWithValue }) => {
    const res = await todolistAPI.createTodolist(title)
    if (res.data.resultCode === resultCode.success) {
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const changeTodolistTitle = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string }
>(`${slice.name}/changeTodolistTitle`, async ({ todolistId, title }, thunkAPI) => {
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistAPI.updateTodolist(todolistId, title)
    if (res.data.resultCode === resultCode.success) {
      return { todolistId, title }
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  })
})

export const todosThunks = { fetchTodos, removeTodolist, addTodolist, changeTodolistTitle }

// types
export type FilterValues = 'all' | 'active' | 'completed'
export type TodolistDomain = TodolistType & {
  filter: FilterValues
  entityStatus: RequestStatus
}
