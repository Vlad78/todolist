import { v1 } from "uuid"

import { TodolistType } from "../app/AppRedux"

// import {
//     addTodolistAC, changeFilterAC, removeTodolistAC, todolistsReducer
// } from './todolists-reducer';

// test("correct todolist should be removed", () => {
//   let todolistId1 = v1();
//   let todolistId2 = v1();

// const startState: TodolistType[] = [
//   { id: todolistId1, title: "What to learn", filter: "all" },
//   { id: todolistId2, title: "What to buy", filter: "all" },
// ];

// const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

// expect(endState.length).toBe(1);

// expect(endState[0].id).toBe(todolistId2);
// });

// test("correct todolist should be added", () => {
//   let todolistId1 = v1();
//   let todolistId2 = v1();

// const startState: TodolistType[] = [
//   { id: todolistId1, title: "What to learn", filter: "all" },
//   { id: todolistId2, title: "What to buy", filter: "all" },
// ];

// const title = "New Todolist";

// const endState = todolistsReducer(startState, addTodolistAC(title, todolistId1));

//   expect(endState.length).toBe(3);
//   expect(endState[2].title).toBe(title);
// });

// test("correct filter of todolist should be changed", () => {
//   let todolistId1 = v1();
//   let todolistId2 = v1();

//   const startState: TodolistType[] = [
//     { id: todolistId1, title: "What to learn", filter: "all" },
//     { id: todolistId2, title: "What to buy", filter: "all" },
//   ];

//   const filter = "completed";
//   const endState = todolistsReducer(startState, changeFilterAC(filter, todolistId2));

//   expect(endState[0].filter).toBe("all");
//   expect(endState[1].filter).toBe(filter);
// });
