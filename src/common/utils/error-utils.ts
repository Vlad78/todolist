import axios from 'axios';
import { Dispatch } from 'redux';

import { AppDispatchType } from '../../app/store';
// import { ResponseType } from "../../features/todolist/api/api"
import { appActions } from '../../model/app-reducer';
import { BaseResponse } from '../types/common.types';


export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch, isGlobalError: boolean = true) => {
  if (isGlobalError) {
    data.messages.length > 0
      ? dispatch(appActions.setAppError({ error: data.messages[0] }))
      : dispatch(appActions.setAppError({ error: "Someting went wrong" }))
  }

  dispatch(appActions.setAppStatus({ status: "failed" }))
}

/**
 * Handles server network errors by dispatching appropriate error and status actions.
 *
 * @param {unknown} err - The error object, which can be of any type.
 * @param {AppDispatchType} dispatch - The dispatch function to send actions to the Redux store.
 * @returns {void}
 */
export const handleServerNetworkError = (err: unknown, dispatch: AppDispatchType): void => {
  let errorMessage = "Some error occurred"

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }

  console.log(errorMessage)

  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: "failed" }))
}

export type ErrorType = {
  message?: string
  statusCode?: string
  error: string
}
