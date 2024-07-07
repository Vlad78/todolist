import { useFormik } from 'formik';
import React from 'react';
import { Navigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { BaseResponse } from '../../../common/types/common.types';
import { login } from '../auth-reducer';


type ErrorsType = {
  email?: string
  password?: string
}

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: ErrorsType = {}

      if (!values.email) {
        errors.email = "Required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }
      if (!values.password) {
        errors.password = "Required"
      } else if (values.password.length < 4) {
        errors.password = "The password must be at least 8 characters long"
      }
      return errors
    },
    onSubmit: async (values, formikHelpers) => {
      console.log(JSON.stringify(values))

      dispatch(login({ data: values }))
        .unwrap()
        .then()
        .catch((res: BaseResponse) => {
          res.fieldsErrors?.forEach((err) => {
            formikHelpers.setFieldError(err.field, err.error)
          })
        })
    },
  })

  if (isLoggedIn) return <Navigate to={"/todolists"} />

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered
              <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps("email")}
                error={!!(formik.touched.email && formik.errors.email)}
                // name="email"
                // onBlur={formik.handleBlur}
                // onChange={formik.handleChange}
                // value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
                error={!!(formik.touched.password && formik.errors.password)}
                // name="password"
                // onBlur={formik.handleBlur}
                // onChange={formik.handleChange}
                // value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              )}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox />}
                {...formik.getFieldProps("rememberMe")}
                // name="rememberMe"
                // onChange={formik.handleChange}
                // value={formik.values.rememberMe}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
}
