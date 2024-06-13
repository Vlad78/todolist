import './App.css';

import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import { LinearProgress } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';

import { CustomizedSnackbars } from './components/ErrorSnapbar';
import { meTC } from './features/login/auth-reducer';
import { MenuButton } from './MenuButton';
import { RequestStatusType } from './model/app-reducer';
import { useAppDispatch, useAppSelector } from './redux/hooks';


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
  entityStatus: RequestStatusType;
};

export type TasksStateType = {
  [key: string]: TaskType[];
};

type ThemeMode = "dark" | "light";

function App() {
  const isInitialized = useAppSelector((state) => state.app.isInitialized);
  const status = useAppSelector((state) => state.app.status);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const dispatch = useAppDispatch();

  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  });

  const changeModeHandler = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    dispatch(meTC());
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
            {!isLoggedIn && isInitialized && <MenuButton>Login</MenuButton>}
            {isLoggedIn && isInitialized && <MenuButton>Logout</MenuButton>}
            <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
            <Switch color={"default"} onChange={changeModeHandler} />
          </div>
        </Toolbar>
        {status === "loading" ? <LinearProgress /> : ""}
      </AppBar>
      <Container fixed>{isInitialized && <Outlet />}</Container>
      <CustomizedSnackbars />
    </ThemeProvider>
  );
}

export default App;
