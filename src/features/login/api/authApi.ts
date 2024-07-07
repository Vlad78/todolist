import { instance } from '../../../common/instance/instance';
import { BaseResponse } from '../../../common/types/common.types';


export const authApi = {
  login(data: LoginType) {
    return instance.post<BaseResponse<UserType>>("auth/login", data)
  },
  logout() {
    return instance.delete<BaseResponse>("auth/login")
  },
  me() {
    return instance.get<BaseResponse<UserType>>("auth/me")
  },
}

export type LoginType = {
  email: String
  password: String
  rememberMe: boolean
}

export type UserType = {
  id: number
  email: string
  login: string
}
