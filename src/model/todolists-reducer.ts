import { FilterValuesType, TodolistType } from "../App";

type ActionValue =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof updateTodolistAC>
  | ReturnType<typeof changeFilterAC>;

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

export const todolistsReducer = (state: TodolistType[], action: ActionValue): TodolistType[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.todolistId);
    }

    case "ADD-TODOLIST": {
      const newTodolist = {
        id: action.payload.todolistId,
        title: action.payload.title,
        isDone: false,
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

    default:
      throw new Error("I don't understand this type");
  }
};
