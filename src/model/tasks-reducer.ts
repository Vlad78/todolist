import { v1 } from "uuid";

import { TasksStateType, TaskType } from "../App";

type ActionValue =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof changeTaskStatusAC>
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof removeTodolistAC>;

export const removeTaskAC = (taskId: string, todolistId: string) => {
  return {
    type: "REMOVE-TASK",
    payload: {
      taskId,
      todolistId,
    },
  } as const;
};

export const addTaskAC = (title: string, todolistId: string) => {
  return {
    type: "ADD-TASK",
    payload: {
      title,
      todolistId,
    },
  } as const;
};

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
  return {
    type: "CHANGE-STATUS-TASK",
    payload: {
      taskId,
      isDone,
      todolistId,
    },
  } as const;
};

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
  return {
    type: "CHANGE-TITLE-TASK",
    payload: {
      taskId,
      title,
      todolistId,
    },
  } as const;
};

export const addTodolistAC = (title: string, todolistId?: string) => {
  return {
    type: "ADD-TODOLIST",
    payload: {
      title,
      todolistId,
    },
  } as const;
};

export const removeTodolistAC = (todolistId: string) => {
  return {
    type: "REMOVE-TODOLIST",
    payload: {
      todolistId,
    },
  } as const;
};

export const tasksReducer = (state: TasksStateType, action: ActionValue): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(
          (e) => e.id !== action.payload.taskId
        ),
      };
    }
    case "ADD-TASK": {
      const newTask = {
        id: v1(),
        title: action.payload.title,
        isDone: false,
      };

      return {
        ...state,
        [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]],
      };
    }
    case "CHANGE-STATUS-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((e) =>
          e.id === action.payload.taskId ? { ...e, isDone: action.payload.isDone } : e
        ),
      };
    }
    case "CHANGE-TITLE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((e) =>
          e.id === action.payload.taskId ? { ...e, title: action.payload.title } : e
        ),
      };
    }
    case "ADD-TODOLIST": {
      return {
        ...state,
        [action.payload.todolistId ? action.payload.todolistId : v1()]: [],
      };
    }
    case "REMOVE-TODOLIST": {
      const newState = { ...state };
      delete newState[action.payload.todolistId];
      return newState;
    }

    default:
      throw new Error("I don't understand this type");
  }
};

console.log(typeof null === "object");
