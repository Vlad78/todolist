import axios from "axios"
import { Dispatch } from "redux"

import { AppDispatchType } from "../../app/store"
import { ResponseType } from "../../features/todolist/api/api"
import { appActions } from "../../model/app-reducer"

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length > 0) {
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    dispatch(appActions.setAppError({ error: "Someting went wrong" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatchType): void => {
  let errorMessage = "Some error occurred"

  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: "failed" }))
}

export type ErrorType = {
  message?: string
  statusCode?: string
  error: string
}
