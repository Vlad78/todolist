import { ChangeEvent, memo } from "react"

import DeleteIcon from "@mui/icons-material/Delete"
import { Checkbox, IconButton, ListItem } from "@mui/material"

import { TodolistType } from "./app/AppRedux"
import { useAppDispatch } from "./common/hooks"
import { EditableSpan } from "./EditableSpan"
import { removeTask, updateTask } from "./model/tasks-reducer"
import { getListItemSx } from "./Todolist.styles"

type ComponentTaskType = {
  task: {
    id: string
    isDone: boolean
    title: string
  }
  todolist: TodolistType
}

export const Task = memo(({ task, todolist }: ComponentTaskType) => {
  const dispatcher = useAppDispatch()

  const removeTaskHandler = () => {
    // dispatcher(removeTaskThunk(todolist.id, task.id))
    dispatcher(removeTask({ todolistId: todolist.id, taskId: task.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatcher(
      updateTask({ todolistId: todolist.id, taskId: task.id, data: { type: "check", value: e.currentTarget.checked } }),
    )
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatcher(updateTask({ todolistId: todolist.id, taskId: task.id, data: { type: "title", value: title } }))
  }

  return (
    <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
      <div>
        <Checkbox checked={task.isDone} onChange={changeTaskStatusHandler} />
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
      </div>
      <IconButton onClick={removeTaskHandler}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
})
