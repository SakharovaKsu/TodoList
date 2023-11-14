import { LoginParams } from './auth.api'
import { FormikHelpers, useFormik } from 'formik'
import { BaseResponse } from '../../common/types'
import { authThunks } from './auth.reducer'
import { useActions } from '../../common/hooks/useActions'

type FormikError = Partial<Omit<LoginParams, 'captcha'>>

export const useLogin = () => {
  const { login } = useActions(authThunks)

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikError = {}
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (!values.password) {
        errors.password = 'Required'
      } else if (values.password.length < 3) {
        errors.password = 'Must be 3 characters or more'
      }

      return errors
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginParams>) => {
      login(values)
        .unwrap()
        .catch((reason: BaseResponse) => {
          reason.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
    },
  })

  return {
    formik,
  }
}
