import {
  changeTodolistEntityStatus,
  changeTodolistFilter,
  FilterValuesType,
  TodolistDomainType,
  todolistsReducer,
  todosThunks,
} from './todolists-reducer'
import { v1 } from 'uuid'
import { TodolistType } from '../../api/todolists-api'
import { RequestStatusType } from '../../app/app-reducer'

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  startState = [
    { id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0 },
    { id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0 },
  ]
})

test('correct todolist should be removed', () => {
  const endState = todolistsReducer(
    startState,
    todosThunks.removeTodolist.fulfilled({ todolistId: todolistId1 }, 'requesId', { todolistId: todolistId1 }),
  )

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
  let todolist: TodolistType = {
    title: 'New Todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  }

  const endState = todolistsReducer(
    startState,
    todosThunks.addTodolist.fulfilled({ todolist }, 'requesId', { title: 'todolist' }),
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(todolist.title)
  expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
  const updateTitle = {
    id: todolistId2,
    title: 'New Todolist',
  }

  const action = todosThunks.changeTodolistTitle.fulfilled(updateTitle, 'requesId', updateTitle)

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(updateTitle.title)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = 'completed'

  const action = changeTodolistFilter({ id: todolistId2, filter: newFilter })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})
test('todolists should be added', () => {
  const action = todosThunks.fetchTodos.fulfilled({ todolists: startState }, 'requesId')

  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})
test('correct entity status of todolist should be changed', () => {
  let newStatus: RequestStatusType = 'loading'

  const action = changeTodolistEntityStatus({ id: todolistId2, status: newStatus })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})
