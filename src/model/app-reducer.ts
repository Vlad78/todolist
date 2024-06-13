export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  error: null as null | string,
  status: "loading" as RequestStatusType,
  isInitialized: false as boolean,
};

type InitialStateType = typeof initialState;

export const appReducer = (
  state: InitialStateType = initialState,
  action: AppActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-INITIALIZED":
      return { ...state, isInitialized: action.isInitialized };
    default:
      return state;
  }
};

export const setStatusAC = (status: RequestStatusType) =>
  ({ type: "APP/SET-STATUS", status }) as const;

export const setErrorAC = (error: string | null) =>
  ({
    type: "APP/SET-ERROR",
    error,
  }) as const;

export const setIsInitializedAC = (isInitialized: boolean) =>
  ({ type: "APP/SET-INITIALIZED", isInitialized }) as const;

export type AppActionsType =
  | ReturnType<typeof setStatusAC>
  | ReturnType<typeof setErrorAC>
  | ReturnType<typeof setIsInitializedAC>;
