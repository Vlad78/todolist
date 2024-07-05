import { TaskModel, TaskType } from "../../../app/AppRedux"
import { instance } from "../../../common/instance/instance"

export const todolistApi = {
  getTodolists: () => {
    return instance.get<ApiTodolistType[]>("/todo-lists")
  },
  createTodolist: (title: string) => {
    return instance.post<ResponseType<{ item: ApiTodolistType }>>("/todo-lists", { title })
  },
  deleteTodolist: (todolistId: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`)
  },
  updateTodolist: (todolistId: string, title: string) => {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}`, { title })
  },
  getTasks: (todolistId: string) => {
    return instance.get(`/todo-lists/${todolistId}/tasks`)
  },
  addTask: (todolistId: string, title: string) => {
    return instance.post<ResponseType<{ item: ApiTaskType }>>(`/todo-lists/${todolistId}/tasks`, {
      title,
    })
  },
  removeTask: (todolistId: string, taskId: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: TaskModel) => {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}

export type UserType = {
  id: number
  email: string
  login: string
}

export type ApiTodolistType = {
  id: string
  addedDate: string
  order: number
  title: string
}

export type ApiTaskType = {
  description: string
  title: string
  completed: boolean
  status: number
  priority: number
  startDate: Date
  deadline: Date
  id: string
  todoListId: string
  order: number
  addedDate: Date
}

export type ResponseType<D = {}> = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldErrorType[]
  data: D
}

type FieldErrorType = {
  error: string
  field: string
}
