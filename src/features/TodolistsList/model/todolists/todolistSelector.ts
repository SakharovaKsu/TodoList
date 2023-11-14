import { AppRootState } from '../../../../app/store'

export const tasksSelector = (state: AppRootState) => state.tasks
export const todolistsSelector = (state: AppRootState) => state.todolists
