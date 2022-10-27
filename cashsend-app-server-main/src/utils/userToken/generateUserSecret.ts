import moment from 'moment'
import { User } from '../../model/User'

export const generateUserSecret = (user: User) =>
  (user.password ? user.password : user.email) + moment(user.createdAt).unix() + process.env.JWT_SECRET
