import { useDispatch, useSelector } from 'react-redux';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatchType, AppRootStateType, AppSelectorType } from '../app/store';
import { UserType } from '../features/login/api/authApi';
import { BaseResponse, FieldErrorType } from './types/common.types';


export const useAppDispatch: () => AppDispatchType = useDispatch<AppDispatchType>
export const useAppSelector: AppSelectorType = useSelector<AppRootStateType>

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatchType
  rejectValue: null | BaseResponse<UserType>
}>()
