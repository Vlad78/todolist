import { ChangeEvent, memo } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, IconButton, ListItem } from '@mui/material';

import { TodolistType } from './AppRedux';
import { EditableSpan } from './EditableSpan';
import { removeTaskThunk, updateTaskThunk } from './model/tasks-reducer';
import { useAppDispatch } from './redux/hooks';
import { getListItemSx } from './Todolist.styles';


type ComponentTaskType = {
  task: {
    id: string;
    isDone: boolean;
    title: string;
  };
  todolist: TodolistType;
};

export const Task = memo(({ task, todolist }: ComponentTaskType) => {
  const dispatcher = useAppDispatch();

  const removeTaskHandler = () => {
    dispatcher(removeTaskThunk(todolist.id, task.id));
  };

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatcher(
      updateTaskThunk(todolist.id, task.id, { type: "check", value: e.currentTarget.checked })
    );
  };

  const changeTaskTitleHandler = (title: string) => {
    dispatcher(updateTaskThunk(todolist.id, task.id, { type: "title", value: title }));
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
