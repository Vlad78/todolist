import './App.css';

import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v1 } from 'uuid';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Unstable_Grid2';

import { AddItemForm } from './AddItemForm';
import { MenuButton } from './MenuButton';
import { addTodolistThunk, getTodosThunk, removeTodolistThunk } from './model/todolists-reducer';
import { useAppDispatch } from './redux/hooks';
import { AppDispatchType, AppRootStateType } from './redux/store';
import { Todolist } from './Todolist';


export type TaskModel = {
  title: string;
  description: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: Date;
  deadline: Date;
};

export type TaskType = TaskModel & {
  id: string;
  title: string;
  isDone: boolean;
  todoListId?: string;
};

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
  addedDate?: string;
  order?: number;
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: TaskType[];
};

type ThemeMode = "dark" | "light";

function App() {
  const todolists = useSelector<AppRootStateType, TodolistType[]>((state) => state.todolists);

  const dispatcher = useAppDispatch();

  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  });

  const changeFilter = useCallback(
    (filter: FilterValuesType, todolistId: string) => {
      dispatcher({ type: "CHANGE-TODOLIST-FILTER", payload: { filter, todolistId } });
    },
    [dispatcher]
  );

  const removeTodolist = useCallback(
    (todolistId: string) => {
      dispatcher(removeTodolistThunk(todolistId));
      // dispatcher({ type: "REMOVE-TODOLIST", payload: { todolistId } });
    },
    [dispatcher]
  );

  const addTodolist = useCallback(
    (title: string) => {
      dispatcher(addTodolistThunk(title));
      // const todolistId = v1();
      // dispatcher({ type: "ADD-TODOLIST", payload: { title, todolistId } });
    },
    [dispatcher]
  );

  const updateTodolist = useCallback(
    (todolistId: string, title: string) => {
      dispatcher({ type: "CHANGE-TODOLIST-TITLE", payload: { title, todolistId } });
    },
    [dispatcher]
  );

  const changeModeHandler = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    dispatcher(getTodosThunk());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: "30px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            <MenuButton>Login</MenuButton>
            <MenuButton>Logout</MenuButton>
            <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
            <Switch color={"default"} onChange={changeModeHandler} />
          </div>
        </Toolbar>
      </AppBar>
      <Container fixed>
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
            );
          })}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
