import axios, { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

import { todolistApi } from "../features/todolist/api/api"

export default {
  title: "API",
}

const settings: AxiosRequestConfig<any> = {
  //   withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer 2910dedc-7139-42d3-8757-d30d3d4bbbe9",
    "API-KEY": "699ee4e8-5315-4be2-b131-5369858ba62a",
  },
  baseURL: "https://social-network.samuraijs.com/api/1.1",
}

export const AuthMe = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    axios
      .get("/auth/me", settings)
      .then((res) => {
        setState(res.data)
      })
      .catch((error) => console.log(error))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistApi.getTodolists().then((res) => setState(res.data))
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    todolistApi
      .createTodolist("test")
      .then((res) => {
        setState(res.data)
      })
      .catch((error) => console.log(error))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistApi.deleteTodolist("999").then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistApi.updateTodolist("999", "updateTitle").then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
