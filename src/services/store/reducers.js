import { combineReducers } from "redux"

import ct from "@constants/"

import theme from "./slices/theme.slice"

const rootReducer = combineReducers({
  [ct.store.THEME_STORE]: theme,
})

export default rootReducer
