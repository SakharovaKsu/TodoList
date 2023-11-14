import { RequestStatus } from '../../../../app/app.reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { tasksThunk } from '../Task/tasks.reducer'
import { createAppAsyncThunk } from '../../../../common/utils/createAppAsyncThunk'
import { todolistAPI } from '../../api/todolists/todolists.api'
import { thunkTryCatch } from '../../../../common/utils/thunkTryCatch'
import { TodolistType } from '../../api/todolists/todolists.types'

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

const changeTodolistTitle = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string }
>(`${slice.name}/changeTodolistTitle`, async ({ todolistId, title }, thunkAPI) => {
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistAPI.updateTodolist(todolistId, title)
    return { todolistId, title }
  })
})

export const todosThunks = { fetchTodos, removeTodolist, addTodolist, changeTodolistTitle }

// types
export type FilterValues = 'all' | 'active' | 'completed'
export type TodolistDomain = TodolistType & {
  filter: FilterValues
  entityStatus: RequestStatus
}
