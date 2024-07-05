import { instance } from "../../../common/instance/instance"
import { ResponseType, UserType } from "../../todolist/api/api"

export const authApi = {
  login(data: LoginType) {
    return instance.post<ResponseType<UserType>>("auth/login", data)
  },
  logout() {
    return instance.delete<ResponseType>("auth/login")
  },
  me() {
    return instance.get<ResponseType<UserType>>("auth/me")
  },
}

export type LoginType = {
  email: String
  password: String
  rememberMe: boolean
}
