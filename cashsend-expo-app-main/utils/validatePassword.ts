import passwordValidator from 'password-validator'

const schema = new passwordValidator()

schema
  .is()
  .min(6)
  .is()
  .max(50)
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .not()
  .spaces()

export const validatePassword = (password: string) => schema.validate(password)
