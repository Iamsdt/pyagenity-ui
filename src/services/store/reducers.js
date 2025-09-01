import { combineReducers } from "redux"

import ct from "@constants/"

import chat from "./slices/chat.slice"
import settings from "./slices/settings.slice"
import theme from "./slices/theme.slice"
import threadSettings from "./slices/threadSettings.slice"

const rootReducer = combineReducers({
  [ct.store.THEME_STORE]: theme,
  [ct.store.CHAT_STORE]: chat,
  [ct.store.SETTINGS_STORE]: settings,
  [ct.store.THREAD_SETTINGS_STORE]: threadSettings,
})

export default rootReducer
