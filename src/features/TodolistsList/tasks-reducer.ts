import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  TodolistType,
  UpdateTaskModelType,
} from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { AppDispatch, AppRootStateType } from '../../app/store'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'
import { setAppStatus } from '../../app/app-reducer'
import { createAsyncThunk, createSlice, isRejectedWithValue, PayloadAction } from '@reduxjs/toolkit'
import { addTodolist, removeTodolist, setTodolists } from './todolists-reducer'
import { rejects } from 'assert'
import { createAppAsyncThunk } from '../../utils/createAppAsyncThunk'

const slice = createSlice({
  name: 'task',
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) tasks.splice(index, 1)
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasks = state[action.payload.task.todoListId]
      tasks.unshift({ ...action.payload.task })
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>,
    ) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model }
    },
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
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl: any) => {
          state[tl.id] = []
        })
      })
  },
})

export const tasksReducer = slice.reducer
export const { removeTask, addTask, updateTask, clearTaskData } = slice.actions

// thunks
// по типизации createAsyncThunk - 1 параметр то что возвращает, 2 параметр то, что приходит в аргументах, 3 параметр - общее свойство санки,
// но так как 3 параметр дублируется везде, выносии типизацию отдельно createAppAsyncThunk
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId, thunkAPI) => {
    try {
      thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
      const res = await todolistsAPI.getTasks(todolistId)
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

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
    const action = removeTask({ taskId, todolistId })
    dispatch(action)
  })
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: 'loading' }))
  todolistsAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        const action = addTask({ task })
        dispatch(action)
        dispatch(setAppStatus({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find((t) => t.id === taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state')
      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    }

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = updateTask({ taskId, model: domainModel, todolistId })
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }

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

export const tasksThunk = { fetchTasks }
