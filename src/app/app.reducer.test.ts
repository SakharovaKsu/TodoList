import { AppInitialState, appReducer, RequestStatus, setAppError } from './app.reducer'

let startState: AppInitialState

beforeEach(() => {
  startState = {
    error: null,
    status: 'idle',
    isInitialized: false,
  }
})

test('correct error message should be set', () => {
  const endState = appReducer(startState, setAppError({ error: 'some error' }))
  expect(endState.error).toBe('some error')
})
