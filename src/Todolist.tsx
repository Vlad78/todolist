import { memo, MouseEventHandler, useCallback, useEffect } from "react"
import { useSelector } from "react-redux"

import DeleteIcon from "@mui/icons-material/Delete"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"

import { AddItemForm } from "./AddItemForm"
import { FilterValuesType, TaskType, TodolistType } from "./app/AppRedux"
import { AppRootStateType } from "./app/store"
import { useAppDispatch, useAppSelector } from "./common/hooks"
import { EditableSpan } from "./EditableSpan"
import { addTask, fetchTasks } from "./model/tasks-reducer"
import { MyButton } from "./MyButton"
import { Task } from "./Task"
import { filterButtonsContainerSx } from "./Todolist.styles"

type PropsType = {
  todolist: TodolistType
  changeFilter: (filter: FilterValuesType, todolistId: string) => void
  removeTodolist: (todolistId: string) => void
  updateTodolist: (todolistId: string, title: string) => void
}

export const Todolist = memo(({ todolist, removeTodolist, updateTodolist, changeFilter }: PropsType) => {
  const tasks = useSelector<AppRootStateType, TaskType[]>((state) => state.tasks[todolist.id])
  const status = useAppSelector((state) => state.app.status)
  const dispatcher = useAppDispatch()

  const onClickAllHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      changeFilterTasksHandler("all")
    },
    [dispatcher],
  )

  const onClickActiveHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      changeFilterTasksHandler("active")
    },
    [dispatcher],
  )

  const onClickCompletedHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      changeFilterTasksHandler("completed")
    },
    [dispatcher],
  )

  const changeFilterTasksHandler = (filter: FilterValuesType) => {
    changeFilter(filter, todolist.id)
  }

  const removeTodolistHandler = () => {
    removeTodolist(todolist.id)
  }

  const updateTodolistHandler = (title: string) => {
    updateTodolist(todolist.id, title)
  }

  const addTaskCallback = useCallback(
    (title: string) => {
      // dispatcher(addTaskThunk(todolist.id, title))
      dispatcher(addTask({ todolistId: todolist.id, title }))
    },
    [dispatcher],
  )

  useEffect(() => {
    dispatcher(fetchTasks(todolist.id))
  }, [dispatcher, todolist.id])

  const allTodolistTasks = tasks
  let filteredTasks = allTodolistTasks || []

  if (todolist.filter === "active") {
    filteredTasks = allTodolistTasks.filter((task) => !task.isDone)
  }

  if (todolist.filter === "completed") {
    filteredTasks = allTodolistTasks.filter((task) => task.isDone)
  }

  return (
    <div>
      <div className={"todolist-title-container"}>
        <h3>
          <EditableSpan value={todolist.title} onChange={updateTodolistHandler} />
        </h3>
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <DeleteIcon />
        </IconButton>
      </div>
      <AddItemForm addItem={addTaskCallback} disabled={status === "loading"} />
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks.map((task) => (
            <Task task={task} todolist={todolist} key={task.id} />
          ))}
        </List>
      )}
      <Box sx={filterButtonsContainerSx}>
        <MyButton
          variant={todolist.filter === "all" ? "outlined" : "text"}
          color={"inherit"}
          onClick={onClickAllHandler}
          title={"All"}
        />
        <MyButton
          variant={todolist.filter === "active" ? "outlined" : "text"}
          color={"primary"}
          onClick={onClickActiveHandler}
          title={"Active"}
        />
        <MyButton
          variant={todolist.filter === "completed" ? "outlined" : "text"}
          color={"secondary"}
          onClick={onClickCompletedHandler}
          title={"Completed"}
        />
      </Box>
    </div>
  )
})
