import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';

import { AppDispatchType, AppRootStateType } from '../../app/store';
import { UserType } from '../../features/login/api/authApi';
import { appActions } from '../../model/app-reducer';
import { BaseResponse } from '../types/common.types';
import { handleServerNetworkError } from './error-utils';


type ThunkAPI = BaseThunkAPI<AppRootStateType, unknown, AppDispatchType, null | BaseResponse<UserType>>

/**
 * A utility function to handle async operations with try-catch-finally blocks.
 *
 * @template T - The type of the resolved value of the callback.
 * @param {ThunkAPI} thunkAPI - The thunk API object containing dispatch and rejectWithValue methods.
 * @param {() => Promise<T>} callback - The async callback function to be executed.
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - The resolved value of the callback or the rejected value.
 */

export const thunkTryCatch = async <T>(
  thunkAPI: ThunkAPI,
  callback: () => T,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    const result = await callback()
    return result
  } catch (error) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }))
  }
}
