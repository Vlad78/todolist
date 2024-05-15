import { ChangeEvent, memo } from 'react';
import { useDispatch } from 'react-redux';

import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, IconButton, ListItem } from '@mui/material';

import { TodolistType } from './AppRedux';
import { EditableSpan } from './EditableSpan';
import { changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './model/tasks-reducer';
import { getListItemSx } from './Todolist.styles';


type TaskType = {
  task: {
    id: string;
    isDone: boolean;
    title: string;
  };
  todolist: TodolistType;
};

export const Task = memo(({ task, todolist }: TaskType) => {
  const dispatcher = useDispatch();

  const removeTaskHandler = () => {
    dispatcher(removeTaskAC(task.id, todolist.id));
  };

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked;
    dispatcher(changeTaskStatusAC(task.id, newStatusValue, todolist.id));
  };

  const changeTaskTitleHandler = (title: string) => {
    dispatcher(changeTaskTitleAC(todolist.id, task.id, title));
  };

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
  );
});
