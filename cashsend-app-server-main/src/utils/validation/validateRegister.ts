import { EmailPasswordInput } from '../../types/graphql/InputTypes/UsernamePasswordInput'
import validator from 'validator'
import { FieldError } from '../../types/graphql/ObjectTypes/FieldError'
import { validatePassword } from './validatePassword'

export const validateRegister = (options: EmailPasswordInput): FieldError[] => {
  if (!validator.isEmail(options.email)) {
    return [
      {
        field: 'email',
        message: 'email invalid'
      }
    ]
  }

  if (!validatePassword(options.password)) {
    return [
      {
        field: 'password',
        message: 'password must be greater than 3'
      }
    ]
  }

  return []
}
