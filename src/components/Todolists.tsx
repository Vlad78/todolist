import { useCallback, useEffect } from "react"
import { Navigate } from "react-router-dom"

import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"

import { AddItemForm } from "../AddItemForm"
import { FilterValuesType, TodolistType } from "../app/AppRedux"
import { useAppDispatch, useAppSelector } from "../common/hooks"
import { addTodolistThunk, getTodosThunk, removeTodolistThunk, updateTodolistThunk } from "../model/todolists-reducer"
import { Todolist } from "../Todolist"

const TodolistsList = () => {
  const todolists = useAppSelector<TodolistType[]>((state) => state.todolists)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const dispatcher = useAppDispatch()

  const addTodolist = useCallback(
    (title: string) => {
      dispatcher(addTodolistThunk(title))
    },
    [dispatcher],
  )

  const changeFilter = useCallback(
    (filter: FilterValuesType, todolistId: string) => {
      dispatcher({ type: "CHANGE-TODOLIST-FILTER", payload: { filter, todolistId } })
    },
    [dispatcher],
  )

  const removeTodolist = useCallback(
    (todolistId: string) => {
      dispatcher(removeTodolistThunk(todolistId))
    },
    [dispatcher],
  )

  const updateTodolist = useCallback(
    (todolistId: string, title: string) => {
      dispatcher(updateTodolistThunk(todolistId, title))
    },
    [dispatcher],
  )

  useEffect(() => {
    if (isLoggedIn) {
      dispatcher(getTodosThunk())
    }
  }, [isLoggedIn, dispatcher])

  if (!isLoggedIn) return <Navigate to={"/todolists"} />

  return (
    <>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>

      <Grid container spacing={4}>
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id}>
              <Paper sx={{ p: "0 20px 20px 20px" }}>
                <Todolist
                  todolist={tl}
                  changeFilter={changeFilter}
                  removeTodolist={removeTodolist}
                  updateTodolist={updateTodolist}
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
