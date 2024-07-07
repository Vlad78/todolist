import axios, { AxiosError } from 'axios';
import { Dispatch } from 'redux';

import { createAsyncThunk, createSlice, current, PayloadAction } from '@reduxjs/toolkit';

import { FilterValuesType, TodolistType } from '../app/AppRedux';
import { STATUS_CODE } from '../common/enum/enum';
import { createAppAsyncThunk } from '../common/hooks';
import {
    ErrorType, handleServerAppError, handleServerNetworkError
} from '../common/utils/error-utils';
import { thunkTryCatch } from '../common/utils/thunkTryCatch';
import { ApiTodolistType, todolistApi } from '../features/todolist/api/api';
import { appActions, RequestStatusType } from './app-reducer';


const initialState: TodolistType[] = []

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    // removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
    //   const i = state.findIndex((todo) => todo.id === action.payload.id)
    //   if (i !== -1) {
    //     state.splice(i, 1)
    //   }
    // },
    // addTodolist: (state, action: PayloadAction<{ todolist: ApiTodolistType }>) => {
    //   state.unshift({
    //     ...action.payload.todolist,
    //     filter: "all",
    //     entityStatus: "idle",
    //   })
    // },
    // changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
    //   const i = state.findIndex((todo) => todo.id === action.payload.id)
    //   if (i !== -1) {
    //     state[i].title = action.payload.title
    //   }
    // },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const i = state.findIndex((todo) => todo.id === action.payload.id)
      if (i !== -1) {
        state[i].filter = action.payload.filter
      }
    },
    // changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
    //   const i = state.findIndex((todo) => todo.id === action.payload.id)
    //   if (i !== -1) {
    //     state[i].entityStatus = action.payload.entityStatus
    //   }
    // },
    // setTodolist: (state, action: PayloadAction<{ todolists: ApiTodolistType[] }>) => {
    //   action.payload.todolists.forEach((tl) => state.push({ ...tl, filter: "all", entityStatus: "idle" }))
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => state.push({ ...tl, filter: "all", entityStatus: "idle" }))
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.todolist,
          filter: "all",
          entityStatus: "idle",
        })
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const i = state.findIndex((todo) => todo.id === action.payload.id)
        if (i !== -1) {
          state.splice(i, 1)
        }
      })
      .addCase(removeTodolist.pending, (state, action) => {
        const i = state.findIndex((todo) => todo.id === action.meta.arg.todolistId)
        if (i !== -1) {
          state[i].entityStatus = "loading"
        }
      })
      .addCase(updateTodolist.fulfilled, (state, action) => {
        const i = state.findIndex((todo) => todo.id === action.payload.id)
        if (i !== -1) {
          state[i].title = action.payload.title
        }
      })
  },
})

//            Thunks

export const getTodos = createAppAsyncThunk(`${slice.name}/getTodos`, async (_, thunkApi) => {
  const { dispatch } = thunkApi

  return thunkTryCatch(thunkApi, async () => {
    const res = await todolistApi.getTodolists()
    dispatch(appActions.setAppStatus({ status: "succeeded" }))
    return { todolists: res.data }
  })
})

export const addTodolist = createAppAsyncThunk<{ todolist: ApiTodolistType }, { title: string }>(
  `${slice.name}/addTodolist`,
  async (arg, thunkApi) => {
    return thunkTryCatch(thunkApi, async () => {
      const res = await todolistApi.createTodolist(arg.title)
      return { todolist: res.data.data.item }
    })
  },
)

// export const addTodolistThunk = (title: string) => (dispatch: Dispatch) => {
//   todolistApi
//     .createTodolist(title)
//     .then((res) => {
//       dispatch(todolistActions.addTodolist({ todolist: res.data.data.item }))
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//     })
//     .catch((error: AxiosError<ErrorType>) => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

// export const removeTodolistThunk = (todolistId: string) => async (dispatch: Dispatch) => {
//   dispatch(todolistActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
//   try {
//     const res = await todolistApi.deleteTodolist(todolistId)
//     if (res.data.resultCode === STATUS_CODE.SUCCESS) {
//       dispatch(todolistActions.removeTodolist({ id: todolistId }))
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   } catch (error) {
//     if (axios.isAxiosError<ErrorType>(error)) {
//       handleServerNetworkError(error, dispatch)
//     }
//   }
// }

export const removeTodolist = createAppAsyncThunk<{ id: string }, { todolistId: string }>(
  `${slice.name}/removeTodolist`,
  async (arg, thunkAPI) => {
    const result = thunkTryCatch(thunkAPI, async () => {
      const { dispatch, rejectWithValue } = thunkAPI
      const res = await todolistApi.deleteTodolist(arg.todolistId)

      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        return { id: arg.todolistId }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })

    return result
  },
)

// export const updateTodolistThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
//   todolistApi.updateTodolist(todolistId, title).then((res) => {
//     dispatch(todolistActions.changeTodolistTitle({ id: todolistId, title }))
//     dispatch(appActions.setAppStatus({ status: "succeeded" }))
//   })
// }

export const updateTodolist = createAppAsyncThunk<{ id: string; title: string }, { todolistId: string; title: string }>(
  `${slice.name}/updateTodolist`,
  async (arg, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const { dispatch, rejectWithValue } = thunkAPI
      const res = await todolistApi.updateTodolist(arg.todolistId, arg.title)
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        return { id: arg.todolistId, title: arg.title }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

export const todolistActions = slice.actions
export const todolistsReducer = slice.reducer
