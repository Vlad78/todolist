import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createAppAsyncThunk } from '../../common/hooks';
import { handleServerAppError, handleServerNetworkError } from '../../common/utils/error-utils';
import { thunkTryCatch } from '../../common/utils/thunkTryCatch';
import { appActions } from '../../model/app-reducer';
import { authApi, LoginType } from './api/authApi';


// import { authApi } from "../todolist/api/api"
// import { LoginType } from "./ui/Login"

const initialState = {
  isLoggedIn: false,
}

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
    //   state.isLoggedIn = action.payload.isLoggedIn
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(me.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})

// thunks

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { data: LoginType }>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authApi.login(arg.data)
      if (res.data.resultCode === 0) {
        // dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { isLoggedIn: true }
      } else {
        const isShowGlobal = res.data.fieldsErrors.length > 0
        handleServerAppError(res.data, dispatch, isShowGlobal)
        return rejectWithValue(res.data)
        // return rejectWithValue(null)
      }
    })
  },
)

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  `${slice.name}/logout`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authApi.logout()
      if (res.data.resultCode === 0) {
        return { isLoggedIn: false }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authApi.me()
      if (res.data.resultCode === 0) {
        // dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { isLoggedIn: true }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(`${slice.name}/me`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authApi.me()
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  }).finally(() => {
    dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
  })
  // try {
  // } catch (error) {
  //   handleServerNetworkError(error, dispatch)
  //   return rejectWithValue(null)
  // } finally {
  //   dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
  // }
})

// export const loginTC = (data: LoginType) => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }))
//   authApi
//     .login(data)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//     })
//     .finally(() => {
//       dispatch(appActions.setAppStatus({ status: "idle" }))
//     })
// }

// export const logoutTC = () => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }))
//   authApi
//     .logout()
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//       dispatch(appActions.setAppStatus({ status: "idle" }))
//     })
// }

// export const meTC = () => (dispatch: Dispatch) => {
//   authApi
//     .me()
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//     })
//     .finally(() => {
//       dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
//       dispatch(appActions.setAppStatus({ status: "idle" }))
//     })
// }

export const authReducer = slice.reducer
export const authActions = slice.actions
