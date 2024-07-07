import './App.css';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import { LinearProgress } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';

import { useAppDispatch, useAppSelector } from '../common/hooks';
import { CustomizedSnackbars } from '../components/ErrorSnapbar';
import { logout, me } from '../features/login/auth-reducer';
import { MenuButton } from '../MenuButton';
import { RequestStatusType, selectStatus } from '../model/app-reducer';


export type TaskModel = {
  title: string
  description: string
  completed: boolean
  status: number
  priority: number
  startDate: Date
  deadline: Date
}

export type TaskType = TaskModel & {
  id: string
  title: string
  isDone: boolean
  todoListId?: string
}

export type FilterValuesType = "all" | "active" | "completed"

export type TodolistType = {
  addedDate?: string
  order?: number
  id: string
  title: string
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export type TasksStateType = Record<string, TaskType[]>

type ThemeMode = "dark" | "light"

function App() {
  const isInitialized = useAppSelector((state) => state.app.isInitialized)
  const status = useSelector(selectStatus)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [themeMode, setThemeMode] = useState<ThemeMode>("light")

  const theme = createTheme({
    palette: {
      mode: themeMode === "light" ? "light" : "dark",
      primary: {
        main: "#087EA4",
      },
    },
  })

  const changeModeHandler = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light")
  }

  useEffect(() => {
    dispatch(me()).then((res) => {
      if (res.payload && "isLoggedIn" in res.payload && !res.payload.isLoggedIn) navigate("/login")
    })
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }
  const handleLogin = () => {
    navigate("/login", { replace: true })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: "30px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {!isLoggedIn && isInitialized && <MenuButton onClick={handleLogin}>Login</MenuButton>}
            {isLoggedIn && isInitialized && <MenuButton onClick={handleLogout}>Logout</MenuButton>}
            <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
            <Switch color={"default"} onChange={changeModeHandler} />
          </div>
        </Toolbar>
        {status === "loading" ? <LinearProgress /> : ""}
      </AppBar>
      <Container fixed>{isInitialized && <Outlet />}</Container>
      <CustomizedSnackbars />
    </ThemeProvider>
  )
}

export default App
