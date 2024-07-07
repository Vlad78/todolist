import { Dispatch } from 'redux';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskModel, TasksStateType, TaskType, TodolistType } from '../app/AppRedux';
import { AppDispatchType, AppRootStateType, AppThunk } from '../app/store';
import { STATUS_CODE } from '../common/enum/enum';
import { createAppAsyncThunk } from '../common/hooks';
import { handleServerAppError, handleServerNetworkError } from '../common/utils/error-utils';
import { thunkTryCatch } from '../common/utils/thunkTryCatch';
import { ApiTaskType, todolistApi } from '../features/todolist/api/api';
import { appActions } from './app-reducer';
import { todolistActions } from './todolists-reducer';


const initialState: TasksStateType = {}

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
    //   const tasks = state[action.payload.todolistId]
    //   const i = tasks.findIndex((task) => task.id === action.payload.taskId)
    //   if (i !== -1) {
    //     tasks.splice(i, 1)
    //   }
    // },
    // addTask: (state, action: PayloadAction<{ task: ApiTaskType }>) => {
    //   const tasks = state[action.payload.task.todoListId!]
    //   const task = { ...action.payload.task, isDone: false }
    //   tasks.unshift(task)
    // },
    // updateTask: (state, action: PayloadAction<{ taskId: string; model: TaskModel; todolistId: string }>) => {
    //   const tasks = state[action.payload.todolistId]
    //   const i = tasks.findIndex((task) => task.id === action.payload.taskId)
    //   if (i !== -1) {
    //     tasks[i] = { ...tasks[i], ...action.payload.model }
    //   }
    // },
    // setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) => {
    //   state[action.payload.todolistId] = action.payload.tasks
    // },
  },
  extraReducers(builder) {
    builder

      // .addCase(todolistActions.addTodolist, (state, action) => {
      //   state[action.payload.todolist.id] = []
      // })
      // .addCase(todolistActions.removeTodolist, (state, action) => {
      //   delete state[action.payload.id]
      // })
      // .addCase(todolistActions.setTodolist, (state, action) => {
      //   action.payload.todolists.forEach((tl) => {
      //     state[tl.id] = []
      //   })
      // })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId!]
        const task = { ...action.payload.task, isDone: false }
        tasks.unshift(task)
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const i = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (i !== -1) {
          tasks.splice(i, 1)
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const i = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (i !== -1) {
          tasks[i] = { ...tasks[i], ...action.payload.model }
        }
      })
  },
})

//                 Thunks

export const fetchTasks = createAppAsyncThunk(`${slice.name}/fetchTasks`, async (todolistId: string, thunkAPI) => {
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistApi.getTasks(todolistId)
    const tasks = res.data.items
    return { tasks, todolistId }
  })
})

export const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  `${slice.name}/addTask`,
  async ({ todolistId, title }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.addTask(todolistId, title)
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        const task: TaskType = { ...res.data.data.item, isDone: false } // Transform ApiTaskType to TaskType
        return { task }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
    // const { dispatch, rejectWithValue } = thunkAPI
    // try {
    //   const res = await todolistApi.addTask(todolistId, title)
    //   if (res.data.resultCode === STATUS_CODE.SUCCESS) {
    //     const task: TaskType = { ...res.data.data.item, isDone: false } // Transform ApiTaskType to TaskType
    //     // dispatch(tasksActions.addTask({ task: res.data.data.item }))
    //     dispatch(appActions.setAppStatus({ status: "succeeded" }))
    //     return { task }
    //   } else {
    //     handleServerAppError(res.data, dispatch)
    //     return rejectWithValue(null)
    //   }
    // } catch (error) {
    //   handleServerNetworkError(error, dispatch)
    //   return rejectWithValue(null)
    // }
  },
)

export const removeTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${slice.name}/removeTask`, async ({ todolistId, taskId }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistApi.removeTask(todolistId, taskId)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      return { todolistId, taskId }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

type UpdateTaskDataType = { type: "check" | "title"; value: boolean | string }

export const updateTask = createAppAsyncThunk<
  { todolistId: string; taskId: string; model: TaskModel },
  { todolistId: string; taskId: string; data: UpdateTaskDataType }
>(`${slice.name}/updateTask`, async ({ todolistId, taskId, data }, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI

  return thunkTryCatch(thunkAPI, async () => {
    const tasksForCurrentTodolist = getState().tasks[todolistId]
    const task = tasksForCurrentTodolist.find((t) => t.id === taskId)
    if (!task) {
      return rejectWithValue(null)
    }
    const updatedModel: TaskModel = {
      title: data.type === "title" && typeof data.value !== "boolean" ? data.value : task.title,
      completed: data.type === "check" && typeof data.value === "boolean" ? data.value : task.completed,
      startDate: task!.startDate,
      priority: task!.priority,
      description: task!.description,
      deadline: task!.deadline,
      status: task!.status,
    }

    const res = await todolistApi.updateTask(todolistId, taskId, updatedModel)
    if (res.status === 200) {
      return { todolistId, taskId, model: updatedModel }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
