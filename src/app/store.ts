import { TypedUseSelectorHook } from "react-redux"
import { AnyAction, applyMiddleware, combineReducers, legacy_createStore, UnknownAction } from "redux"
import { thunk, ThunkAction, ThunkDispatch } from "redux-thunk"

import { configureStore, createAsyncThunk } from "@reduxjs/toolkit"

import { authReducer } from "../features/login/auth-reducer"
import { appReducer } from "../model/app-reducer"
import { tasksReducer } from "../model/tasks-reducer"
import { todolistsReducer } from "../model/todolists-reducer"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

window.store = store

declare global {
  interface Window {
    store: typeof store
  }
}

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, UnknownAction>
export type AppSelectorType = TypedUseSelectorHook<AppRootStateType>
