import { combineReducers } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import user from './slices/userSlice'

const rootReducer = combineReducers({ auth, user })

export default rootReducer
