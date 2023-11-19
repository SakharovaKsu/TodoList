import { AppRootState } from './store'
import { useSelector } from 'react-redux'

export const statusSelector = (state: AppRootState) => state.app.status
export const isInitializedSelector = (state: AppRootState) => state.app.isInitialized
export const errorSelector = (state: AppRootState) => state.app.error
