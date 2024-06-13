import { Dispatch } from 'redux';

import { authApi } from '../../api/api';
import { AppActionsType, setIsInitializedAC, setStatusAC } from '../../model/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { LoginType } from './Login';


const initialState = {
  isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};
// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({ type: "login/SET-IS-LOGGED-IN", value }) as const;

// thunks
export const loginTC = (data: LoginType) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setStatusAC("loading"));
  authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    })
    .finally(() => {
      dispatch(setStatusAC("idle"));
    });
};

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setStatusAC("loading"));
  authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(setStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
      dispatch(setStatusAC("idle"));
    });
};

export const meTC = () => (dispatch: Dispatch<ActionsType>) => {
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true));
      dispatch(setStatusAC("idle"));
    });
};

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppActionsType;
