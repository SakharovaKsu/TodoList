import { setAppError } from '../../../../app/app.reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todosThunks } from '../todolists/todolists.reducer'
import { createAppAsyncThunk } from '../../../../common/utils/createAppAsyncThunk'
import { handleServerAppError } from '../../../../common/utils/handleServerAppError'
import { resultCode } from '../../../../common/resultCode/resultCode'
import { TaskPriorities, TaskStatuses } from '../../../../common/enums/enums'
import { thunkTryCatch } from '../../../../common/utils/thunkTryCatch'
import { tasksApi } from '../../api/tasks/tasks.api'
import { TaskType, UpdateTaskModel } from '../../api/tasks/tasks.types'

type UpdateTaskArg = {
  taskId: string
  domainModel: UpdateDomainTaskModel
  todolistId: string
}

const slice = createSlice({
  name: 'task',
  initialState: {} as TasksState,
  reducers: {
    clearTaskData: (state, action: PayloadAction) => {
      state = { ...{} }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId]
        tasks.unshift({ ...action.payload.task })
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) tasks.splice(index, 1)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.domainModel }
      })
      .addCase(todosThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todosThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
  },
})

export const tasksReducer = slice.reducer

// thunks
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  (todolistId, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.getTasks(todolistId)
      const tasks = res.data.items
      return { tasks, todolistId }
    })
  },
)

const removeTask = createAppAsyncThunk<{ taskId: string; todolistId: string }, { taskId: string; todolistId: string }>(
  `${slice.name}/removeTask`,
  (arg, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.deleteTask(arg.todolistId, arg.taskId)
      return arg
    })
  },
)

const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  'tasks/addTask',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.createTask(arg.todolistId, arg.title)
      if (res.data.resultCode === resultCode.success) {
        const task = res.data.data.item
        return { task }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

const updateTask = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>('tasks/updateTask', async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const state = getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)

    if (!task) {
      dispatch(setAppError({ error: 'Task not found' }))
      return rejectWithValue(null)
    }

    const apiModel: UpdateTaskModel = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    }

    const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel)
    if (res.data.resultCode === resultCode.success) {
      return arg
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

export const tasksThunk = { fetchTasks, addTask, updateTask, removeTask }

// types
export type UpdateDomainTaskModel = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksState = {
  [key: string]: TaskType[]
}
