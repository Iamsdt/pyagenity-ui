import { combineReducers } from "redux"

import ct from "@constants/"

import theme from "./slices/theme.slice"
import user from "./slices/user.slice"

const rootReducer = combineReducers({
  [ct.store.USER_STORE]: user,
  [ct.store.THEME_STORE]: theme,
})

export default rootReducer
