import axios, { AxiosError } from "axios"
import { Dispatch } from "redux"

import { createSlice, current, PayloadAction } from "@reduxjs/toolkit"

import { FilterValuesType, TodolistType } from "../app/AppRedux"
import { STATUS_CODE } from "../common/enum/enum"
import { ErrorType, handleServerAppError, handleServerNetworkError } from "../common/utils/error-utils"
import { ApiTodolistType, todolistApi } from "../features/todolist/api/api"
import { appActions, RequestStatusType } from "./app-reducer"

const initialState: TodolistType[] = []

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const i = state.findIndex((todo) => todo.id === action.payload.id)
      if (i !== -1) {
        state.splice(i, 1)
      }
    },
    addTodolist: (state, action: PayloadAction<{ todolist: ApiTodolistType }>) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      })
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const i = state.findIndex((todo) => todo.id === action.payload.id)
      if (i !== -1) {
        state[i].title = action.payload.title
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const i = state.findIndex((todo) => todo.id === action.payload.id)
      if (i !== -1) {
        state[i].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const i = state.findIndex((todo) => todo.id === action.payload.id)
      if (i !== -1) {
        state[i].entityStatus = action.payload.entityStatus
      }
    },
    setTodolist: (state, action: PayloadAction<{ todolists: ApiTodolistType[] }>) => {
      action.payload.todolists.forEach((tl) => state.push({ ...tl, filter: "all", entityStatus: "idle" }))
    },
  },
})

//            Thunks

export const getTodosThunk = () => (dispatch: Dispatch) => {
  todolistApi.getTodolists().then((res) => {
    dispatch(todolistActions.setTodolist({ todolists: res.data }))
    dispatch(appActions.setAppStatus({ status: "succeeded" }))
  })
}

export const addTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  todolistApi
    .createTodolist(title)
    .then((res) => {
      dispatch(todolistActions.addTodolist({ todolist: res.data.data.item }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    })
    .catch((error: AxiosError<ErrorType>) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const removeTodolistThunk = (todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(todolistActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
  try {
    const res = await todolistApi.deleteTodolist(todolistId)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      dispatch(todolistActions.removeTodolist({ id: todolistId }))
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    if (axios.isAxiosError<ErrorType>(error)) {
      handleServerNetworkError(error, dispatch)
    }
  }
}

export const updateTodolistThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistApi.updateTodolist(todolistId, title).then((res) => {
    dispatch(todolistActions.changeTodolistTitle({ id: todolistId, title }))
    dispatch(appActions.setAppStatus({ status: "succeeded" }))
  })
}

export const todolistActions = slice.actions
export const todolistsReducer = slice.reducer
