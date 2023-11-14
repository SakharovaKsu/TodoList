import { AppRootState } from './store'

export const statusSelector = (state: AppRootState) => state.app.status
export const isInitializedSelector = (state: AppRootState) => state.app.isInitialized
