import axios, { AxiosError } from "axios";
import { Dispatch } from "redux";

import { ApiTodolistType, STATUS_CODE, todolistApi } from "../api/api";
import { FilterValuesType, TodolistType } from "../AppRedux";
import { ErrorType, handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { RequestStatusType, setErrorAC, setStatusAC } from "./app-reducer";

type ActionValue =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof updateTodolistAC>
  | ReturnType<typeof changeFilterAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof setEntityStatusAC>;

export const removeTodolistAC = (todolistId: string) => {
  return {
    type: "REMOVE-TODOLIST",
    payload: {
      todolistId,
    },
  } as const;
};

export const addTodolistAC = (todolistId: string, title: string) => {
  return {
    type: "ADD-TODOLIST",
    payload: {
      todolistId,
      title,
    },
  } as const;
};

export const updateTodolistAC = (todolistId: string, title: string) => {
  return {
    type: "CHANGE-TODOLIST-TITLE",
    payload: {
      todolistId,
      title,
    },
  } as const;
};

export const changeFilterAC = (filter: FilterValuesType, todolistId: string) => {
  return {
    type: "CHANGE-TODOLIST-FILTER",
    payload: {
      todolistId,
      filter,
    },
  } as const;
};

export const setTodolistsAC = (todolists: ApiTodolistType[]) => {
  return {
    type: "SET-TODOLISTS",
    payload: {
      todolists,
    },
  } as const;
};

export const setEntityStatusAC = (todolistsId: string, entityStatus: RequestStatusType) => {
  return {
    type: "SET-ENTITY-STATUS",
    payload: {
      todolistsId,
      entityStatus,
    },
  } as const;
};

//            Thunks

export const getTodosThunk = () => (dispatch: Dispatch) => {
  // dispatch(setStatusAC("loading"));
  todolistApi.getTodolists().then((res) => {
    dispatch(setTodolistsAC(res.data));
    dispatch(setStatusAC("succeeded"));
  });
};

export const addTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  // dispatch(setStatusAC("loading"));
  todolistApi
    .createTodolist(title)
    .then((res) => {
      dispatch(addTodolistAC(res.data.data.item.id, title));
      dispatch(setStatusAC("succeeded"));
    })
    .catch((error: AxiosError<ErrorType>) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const removeTodolistThunk = (todolistId: string) => async (dispatch: Dispatch) => {
  // dispatch(setStatusAC("loading"));
  dispatch(setEntityStatusAC(todolistId, "loading"));
  try {
    const res = await todolistApi.deleteTodolist(todolistId);
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      dispatch(removeTodolistAC(todolistId));
      dispatch(setStatusAC("succeeded"));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (error) {
    if (axios.isAxiosError<ErrorType>(error)) {
      handleServerNetworkError(error, dispatch);
    }
  }
};

export const updateTodolistThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  // dispatch(setStatusAC("loading"));
  todolistApi.updateTodolist(todolistId, title).then((res) => {
    dispatch(updateTodolistAC(todolistId, title));
    dispatch(setStatusAC("succeeded"));
  });
};

const initialTodolistState: TodolistType[] = [];

export const todolistsReducer = (
  state = initialTodolistState,
  action: ActionValue
): TodolistType[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.todolistId);
    }

    case "ADD-TODOLIST": {
      const newTodolist = {
        id: action.payload.todolistId,
        title: action.payload.title,
        filter: "all",
        entityStatus: "idle",
      } as TodolistType;

      return [...state, newTodolist];
    }

    case "CHANGE-TODOLIST-TITLE": {
      return state.map((e) =>
        e.id === action.payload.todolistId ? { ...e, title: action.payload.title } : e
      );
    }

    case "CHANGE-TODOLIST-FILTER": {
      return state.map((e) =>
        e.id === action.payload.todolistId ? { ...e, filter: action.payload.filter } : e
      );
    }

    case "SET-TODOLISTS": {
      return action.payload.todolists.map((e) => ({ ...e, filter: "all", entityStatus: "idle" }));
    }
    case "SET-ENTITY-STATUS": {
      return state.map((tl) =>
        tl.id === action.payload.todolistsId
          ? { ...tl, entityStatus: action.payload.entityStatus }
          : tl
      );
    }

    default:
      // throw new Error("I don't understand this type");
      return state;
  }
};
