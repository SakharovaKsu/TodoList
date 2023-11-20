import React from 'react'
import { useSelector } from 'react-redux'
import { AppRootState } from '../../app/store'
import { Navigate } from 'react-router-dom'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from '@mui/material'
import { isLoggedInSelector } from './authSelector'
import s from './Login.module.css'
import { useLogin } from './useLogin'

export const Login = () => {
  const { formik } = useLogin()

  const isLoggedIn = useSelector<AppRootState, boolean>(isLoggedInSelector)

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{' '}
                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps('email')} />
              {formik.errors.email ? <div className={s.error}>{formik.errors.email}</div> : null}
              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps('password')} />
              {formik.errors.password ? <div className={s.error}>{formik.errors.password}</div> : null}
              <FormControlLabel
                label={'Remember me'}
                control={<Checkbox {...formik.getFieldProps('rememberMe')} checked={formik.values.rememberMe} />}
              />
              <Button type={'submit'} variant={'contained'} color={'primary'}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
