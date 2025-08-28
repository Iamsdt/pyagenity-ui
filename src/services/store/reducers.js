import { combineReducers } from "redux"

import ct from "@constants/"

import chat from "./slices/chat.slice"
import settings from "./slices/settings.slice"
import theme from "./slices/theme.slice"

const rootReducer = combineReducers({
  [ct.store.THEME_STORE]: theme,
  [ct.store.CHAT_STORE]: chat,
  [ct.store.SETTINGS_STORE]: settings,
})

export default rootReducer
