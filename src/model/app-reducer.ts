import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { createAppAsyncThunk } from "../common/hooks"
import { authApi } from "../features/login/api/authApi"

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
  error: null as null | string,
  status: "loading" as RequestStatusType,
  isInitialized: false as boolean,
}

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  selectors: {
    selectStatus: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
    selectIsInitialized: (sliceState) => sliceState.isInitialized,
  },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export type AppInitialState = ReturnType<typeof slice.getInitialState>
export const { selectError, selectIsInitialized, selectStatus } = slice.selectors
