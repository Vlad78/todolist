import { Dispatch } from 'redux';

import { ResponseType } from '../api/api';
import { setErrorAC, setStatusAC } from '../model/app-reducer';


export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setErrorAC(error.message));
  dispatch(setStatusAC("failed"));
};

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length > 0) {
    dispatch(setErrorAC(data.messages[0]));
  } else {
    dispatch(setErrorAC("Someting went wrong"));
  }
  dispatch(setStatusAC("failed"));
};

export type ErrorType = {
  message?: string;
  statusCode?: string;
  error: string;
};
