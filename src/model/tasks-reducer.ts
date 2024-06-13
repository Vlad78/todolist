import { Dispatch } from "redux";
import { v1 } from "uuid";

import { STATUS_CODE, todolistApi } from "../api/api";
import { TaskModel, TasksStateType, TaskType } from "../AppRedux";
import { AppRootStateType } from "../redux/store";
import { handleServerAppError } from "../utils/error-utils";
import { setErrorAC, setStatusAC } from "./app-reducer";
import { setTodolistsAC } from "./todolists-reducer";

type ActionValue =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof removeAllTasksAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof changeTaskStatusAC>
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof setTasksAC>;

export const removeTaskAC = (todolistId: string, taskId: string) => {
  return {
    type: "REMOVE-TASK",
    payload: {
      taskId,
      todolistId,
    },
  } as const;
};

export const removeAllTasksAC = (todolistId: string) => {
  return {
    type: "REMOVE-ALL-TASKS",
    payload: {
      todolistId,
    },
  } as const;
};

export const addTaskAC = (task: TaskType) => {
  return {
    type: "ADD-TASK",
    payload: {
      task,
    },
  } as const;
};

export const changeTaskStatusAC = (todolistId: string, taskId: string, isDone: boolean) => {
  return {
    type: "CHANGE-STATUS-TASK",
    payload: {
      taskId,
      isDone,
      todolistId,
    },
  } as const;
};

export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => {
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

export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
  return {
    type: "SET-TASKS",
    paylod: {
      todolistId,
      tasks,
    },
  } as const;
};

//                 Thunks

export const getTasksThunk = (todolistId: string) => (dispatch: Dispatch) => {
  // dispatch(setStatusAC("loading"));
  todolistApi.getTasks(todolistId).then((res) => {
    dispatch(setTasksAC(todolistId, res.data.items));
    dispatch(setStatusAC("succeeded"));
  });
};

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(setStatusAC("loading"));
  todolistApi.addTask(todolistId, title).then((res) => {
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      dispatch(addTaskAC({ ...res.data.data.item, isDone: false }));
      dispatch(setStatusAC("succeeded"));
    } else {
      handleServerAppError(res.data, dispatch);
      // if (res.data.messages.length > 0) {
      //   dispatch(setErrorAC(res.data.messages[0]));
      // } else {
      //   dispatch(setErrorAC("Someting went wrong"));
      // }
      // dispatch(setStatusAC("failed"));
    }
  });
};

export const removeTaskThunk = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(setStatusAC("loading"));
  todolistApi.removeTask(todolistId, taskId).then((res) => {
    if (res.status === 200) {
      dispatch(removeTaskAC(todolistId, taskId));
      dispatch(setStatusAC("succeeded"));
    } else if (res.status >= 400 && res.status <= 499) {
      dispatch(setErrorAC(res.statusText));
    }
  });
};

type UpdateTaskDataType = { type: "check" | "title"; value: boolean | string };

export const updateTaskThunk =
  (todolistId: string, taskId: string, data: UpdateTaskDataType) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const tasksForCurrentTodolist = getState().tasks[todolistId];
    const task = tasksForCurrentTodolist.find((t) => t.id === taskId);

    if (!task) return;

    const updatedModel: TaskModel = {
      title: data.type === "title" && typeof data.value === "string" ? data.value : task.title,
      completed:
        data.type === "check" && typeof data.value === "boolean" ? data.value : task.completed,
      startDate: task!.startDate,
      priority: task!.priority,
      description: task!.description,
      deadline: task!.deadline,
      status: task!.status,
    };

    try {
      todolistApi.updateTask(todolistId, taskId, updatedModel).then((res) => {
        if (data.type === "check" && res.status === 200) {
          dispatch(changeTaskStatusAC(todolistId, taskId, updatedModel.completed));
        } else if (data.type === "title" && res.status === 200) {
          dispatch(changeTaskTitleAC(todolistId, taskId, updatedModel.title));
        } else {
          throw new Error("Server returned error: " + res.statusText);
        }
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

//                  Reducer

const initialTasksState: TasksStateType = {};

export const tasksReducer = (state = initialTasksState, action: ActionValue): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(
          (e) => e.id !== action.payload.taskId
        ),
      };
    }
    case "REMOVE-ALL-TASKS": {
      delete state[action.payload.todolistId];
      return state;
    }
    case "ADD-TASK": {
      return {
        ...state,
        [action.payload.task.todoListId!]: [
          action.payload.task,
          ...state[action.payload.task.todoListId!],
        ],
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
    case "SET-TODOLISTS": {
      return action.payload.todolists.reduce((pr, cur) => {
        return { ...pr, [cur.id]: [] };
      }, {});
    }
    case "SET-TASKS": {
      return {
        ...state,
        [action.paylod.todolistId]: action.paylod.tasks,
      };
    }

    default:
      // throw new Error("I don't understand this type");
      return state;
  }
};
