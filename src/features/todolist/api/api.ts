import { TaskModel } from '../../../app/AppRedux';
import { instance } from '../../../common/instance/instance';
import { BaseResponse } from '../../../common/types/common.types';
import { RequestStatusType } from '../../../model/app-reducer';


export const todolistApi = {
  getTodolists: () => {
    return instance.get<ApiTodolistType[]>("/todo-lists")
  },
  createTodolist: (title: string) => {
    return instance.post<BaseResponse<{ item: ApiTodolistType }>>("/todo-lists", { title })
  },
  deleteTodolist: (todolistId: string) => {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}`)
  },
  updateTodolist: (todolistId: string, title: string) => {
    return instance.put<BaseResponse>(`/todo-lists/${todolistId}`, { title })
  },
  getTasks: (todolistId: string) => {
    return instance.get(`/todo-lists/${todolistId}/tasks`)
  },
  addTask: (todolistId: string, title: string) => {
    return instance.post<BaseResponse<{ item: ApiTaskType }>>(`/todo-lists/${todolistId}/tasks`, {
      title,
    })
  },
  removeTask: (todolistId: string, taskId: string) => {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: TaskModel) => {
    return instance.put<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
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

export type TaskPriority = number

export type UpdateTaskModel = {
  title: string
  description: string
  status: RequestStatusType
  priority: TaskPriority
  startDate: string
  deadline: string
}
