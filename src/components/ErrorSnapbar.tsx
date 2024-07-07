import * as React from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import { useAppDispatch, useAppSelector } from '../common/hooks';
import { appActions } from '../model/app-reducer';


export const CustomizedSnackbars = () => {
  const error = useAppSelector((state) => state.app.error)
  const dispatch = useAppDispatch()

  console.log(error)

  //   const handleClick = () => {
  //     setOpen(true);
  //   };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }

    // dispatch(setErrorAC(null));
    dispatch(appActions.setAppError({ error: null }))
  }

  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}
