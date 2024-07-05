import { Dispatch } from "redux"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { handleServerAppError, handleServerNetworkError } from "../../common/utils/error-utils"
import { appActions } from "../../model/app-reducer"
import { authApi, LoginType } from "./api/authApi"

// import { authApi } from "../todolist/api/api"
// import { LoginType } from "./ui/Login"

const initialState = {
  isLoggedIn: false,
}

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
})

// thunks
export const loginTC = (data: LoginType) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))
  authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(appActions.setAppStatus({ status: "idle" }))
    })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
      dispatch(appActions.setAppStatus({ status: "idle" }))
    })
}

export const meTC = () => (dispatch: Dispatch) => {
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
      dispatch(appActions.setAppStatus({ status: "idle" }))
    })
}

export const authReducer = slice.reducer
export const authActions = slice.actions
