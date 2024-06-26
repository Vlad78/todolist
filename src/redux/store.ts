import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';

import { tasksReducer } from '../model/tasks-reducer';
import { todolistsReducer } from '../model/todolists-reducer';


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});
// непосредственно создаём store
// @ts-ignore
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

window.store = store;

declare global {
  interface Window {
    store: typeof store;
  }
}

export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>;
