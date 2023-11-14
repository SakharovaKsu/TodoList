import { TodolistDomain, todolistsReducer, todosThunks } from '../todolists/todolists.reducer'
import { tasksReducer, TasksState } from '../Task/tasks.reducer'
import { TodolistType } from '../../api/todolists/todolists.api'

test('ids should be equals', () => {
  const startTasksState: TasksState = {}
  const startTodolistsState: Array<TodolistDomain> = []

  let todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  }

  const action = todosThunks.addTodolist.fulfilled({ todolist }, 'requesId', { title: 'todolist' })

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
