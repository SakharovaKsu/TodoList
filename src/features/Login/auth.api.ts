import { instance } from '../../common/api/instance'
import { BaseResponse } from './../../common/types/index'

export const authApi = {
  login(data: LoginParams) {
    return instance.post<BaseResponse<{ userId?: number }>>('auth/login', data)
  },
  logout() {
    return instance.delete<BaseResponse<{ userId?: number }>>('auth/login')
  },
  me() {
    return instance.get<BaseResponse<{ id: number; email: string; login: string }>>('auth/me')
  },
}

// type
export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}
