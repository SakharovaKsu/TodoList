import { handleServerNetworkError } from '../../common/utils/handleServerNetworkError'
import { setAppError, setAppStatus } from '../../app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todosThunks } from './todolists-reducer'
import { createAppAsyncThunk } from '../../common/utils/createAppAsyncThunk'
import { handleServerAppError } from '../../common/utils/handleServerAppError'
import { TaskType, todolistAPI, UpdateTaskModelType } from './todolists-api'
import { resultCode } from '../../common/resultCode/resultCode'
import { TaskPriorities, TaskStatuses } from '../../common/enums/enums'
import { thunkTryCatch } from '../../common/utils/thunkTryCatch'

type UpdateTaskArg = {
  taskId: string
  domainModel: UpdateDomainTaskModelType
  todolistId: string
}

const slice = createSlice({
  name: 'task',
  initialState: {} as TasksStateType,
  reducers: {
    clearTaskData: (state, action: PayloadAction) => {
      state = { ...{} }
    },
  },

  // Когда нам необходимо обработать case, который был создан в другом slice
  // в builder.addCase добавляем action creator и функцию
  extraReducers: (builder) => {
    builder
      // первым параметром идет то, что хотим обрабатывать, второе - редбюсер
      .addCase(fetchTasks.fulfilled, (state, action) => {
        // пишем логику, которую писали в setTasks в slice.reducer, теперь action creator не нужны, объединили TC и AC
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
export const { clearTaskData } = slice.actions

// thunks
// по типизации createAsyncThunk - 1 параметр то что возвращает, 2 параметр то, что приходит в аргументах, 3 параметр - общее свойство санки,
// но так как 3 параметр дублируется везде, выносии типизацию отдельно createAppAsyncThunk
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId, thunkAPI) => {
    try {
      thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
      const res = await todolistAPI.getTasks(todolistId)
      const tasks = res.data.items
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      // thunkAPI.dispatch(setTasks({ tasks, todolistId }))
      // после ретурна -> в slice -> extraReducers, и значения оказываются в action
      return { tasks, todolistId }
    } catch (error: any) {
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  },
)

const removeTask = createAppAsyncThunk<{ taskId: string; todolistId: string }, { taskId: string; todolistId: string }>(
  `${slice.name}/removeTask`,
  async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    try {
      const res = await todolistAPI.deleteTask(arg.todolistId, arg.taskId)
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      return arg
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  },
)

const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  'tasks/addTask',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistAPI.createTask(arg.todolistId, arg.title)
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
  try {
    dispatch(setAppStatus({ status: 'loading' }))
    const state = getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)

    if (!task) {
      dispatch(setAppError({ error: 'Task not found' }))
      return rejectWithValue(null)
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    }

    const res = await todolistAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
    if (res.data.resultCode === resultCode.success) {
      dispatch(setAppStatus({ status: 'succeeded' }))
      return arg
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

export const tasksThunk = { fetchTasks, addTask, updateTask, removeTask }

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
