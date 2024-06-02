import { Dispatch } from 'redux';

import { ApiTodolistType, todolistApi } from '../api/api';
import { FilterValuesType, TodolistType } from '../AppRedux';


type ActionValue =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof updateTodolistAC>
  | ReturnType<typeof changeFilterAC>
  | ReturnType<typeof setTodolistsAC>;

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

//            Thunks

export const getTodosThunk = () => (dispatch: Dispatch) => {
  todolistApi.getTodolists().then((res) => dispatch(setTodolistsAC(res.data)));
};

export const addTodolistThunk = (title: string) => (dispatch: Dispatch) => {
  todolistApi
    .createTodolist(title)
    .then((res) => dispatch(addTodolistAC(res.data.data.item.id, title)));
};

export const removeTodolistThunk = (todolistId: string) => (dispatch: Dispatch) => {
  todolistApi.deleteTodolist(todolistId).then((res) => {
    dispatch(removeTodolistAC(todolistId));
  });
};

export const updateTodolistThunk = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistApi.updateTodolist(todolistId, title).then((res) => {
    dispatch(updateTodolistAC(todolistId, title));
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
      return action.payload.todolists.map((e) => ({ ...e, filter: "all" }));
    }

    default:
      // throw new Error("I don't understand this type");
      return state;
  }
};
