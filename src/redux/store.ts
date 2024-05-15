import { combineReducers, legacy_createStore } from 'redux';

import { tasksReducer } from '../model/tasks-reducer';
import { todolistsReducer } from '../model/todolists-reducer';


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});
// непосредственно создаём store
export const store = legacy_createStore(rootReducer);
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

window.store = store;

declare global {
  interface Window {
    store: typeof store;
  }
}
