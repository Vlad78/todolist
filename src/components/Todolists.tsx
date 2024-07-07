import { useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import { AddItemForm } from '../AddItemForm';
import { FilterValuesType, TodolistType } from '../app/AppRedux';
import { useAppDispatch, useAppSelector } from '../common/hooks';
import { addTodolist, getTodos, removeTodolist, updateTodolist } from '../model/todolists-reducer';
import { Todolist } from '../Todolist';


const TodolistsList = () => {
  const todolists = useAppSelector<TodolistType[]>((state) => state.todolists)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const dispatcher = useAppDispatch()

  const addTodolistHandler = useCallback(
    (title: string) => {
      dispatcher(addTodolist({ title }))
    },
    [dispatcher],
  )

  const changeFilterHandler = useCallback(
    (filter: FilterValuesType, todolistId: string) => {
      dispatcher({ type: "CHANGE-TODOLIST-FILTER", payload: { filter, todolistId } })
    },
    [dispatcher],
  )

  const removeTodolistHandler = useCallback(
    (todolistId: string) => {
      dispatcher(removeTodolist({ todolistId }))
    },
    [dispatcher],
  )

  const updateTodolistHandler = useCallback(
    (todolistId: string, title: string) => {
      dispatcher(updateTodolist({ todolistId, title }))
    },
    [dispatcher],
  )

  useEffect(() => {
    if (isLoggedIn) {
      dispatcher(getTodos())
    }
  }, [isLoggedIn, dispatcher])

  if (!isLoggedIn) return <Navigate to={"/todolists"} />

  return (
    <>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>

      <Grid container spacing={4}>
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id}>
              <Paper sx={{ p: "0 20px 20px 20px" }}>
                <Todolist
                  todolist={tl}
                  changeFilter={changeFilterHandler}
                  removeTodolist={removeTodolistHandler}
                  updateTodolist={updateTodolistHandler}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
export default TodolistsList
