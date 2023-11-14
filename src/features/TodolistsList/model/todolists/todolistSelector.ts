import { AppRootStateType } from '../../../../app/store'

export const tasksSelector = (state: AppRootStateType) => state.tasks
export const todolistsSelector = (state: AppRootStateType) => state.todolists
