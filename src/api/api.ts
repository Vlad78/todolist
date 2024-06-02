import axios from 'axios';

import { TaskModel } from '../AppRedux';


const instance = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer 2910dedc-7139-42d3-8757-d30d3d4bbbe9",
    "API-KEY": "699ee4e8-5315-4be2-b131-5369858ba62a",
  },
  baseURL: "https://social-network.samuraijs.com/api/1.1",
});

export const todolistApi = {
  getTodolists: () => {
    return instance.get<ApiTodolistType[]>("/todo-lists");
  },
  createTodolist: (title: string) => {
    return instance.post<ResponseType<{ item: ApiTodolistType }>>("/todo-lists", { title });
  },
  deleteTodolist: (todolistId: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`);
  },
  updateTodolist: (todolistId: string, title: string) => {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}`, { title });
  },
  getTasks: (todolistId: string) => {
    return instance.get(`/todo-lists/${todolistId}/tasks`);
  },
  addTask: (todolistId: string, title: string) => {
    return instance.post<ResponseType<{ item: ApiTaskType }>>(`/todo-lists/${todolistId}/tasks`, {
      title,
    });
  },
  removeTask: (todolistId: string, taskId: string) => {
    return instance.delete(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
  updateTask: (todolistId: string, taskId: string, model: TaskModel) => {
    return instance.put(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type ApiTodolistType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};

export type ApiTaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: Date;
  deadline: Date;
  id: string;
  todoListId: string;
  order: number;
  addedDate: Date;
};

type ResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  fieldsErrors: FieldErrorType[];
  data: D;
};

type FieldErrorType = {
  error: string;
  field: string;
};
