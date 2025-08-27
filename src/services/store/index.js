import { configureStore } from "@reduxjs/toolkit"
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import rootReducer from "./reducers"
// import * as Sentry from '@sentry/react'

export const config = {
  key: "root",
  storage,

  debug: import.meta.env.DEV,
}

const resetEnhancer = (root) => (state, action) => {
  if (action.type !== "RESET") return root(state, action)
  storage.removeItem("persist:root")
  return root(undefined, {})
}

const persistedReducer = persistReducer(config, resetEnhancer(rootReducer))

// const sentryReduxEnhancer = Sentry.createReduxEnhancer({
//     // Optionally pass options listed below
// })

export const store = configureStore({
  reducer: persistedReducer,

  devTools: import.meta.env.DEV,
  // enhancers: [sentryReduxEnhancer], # Add Sentry
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const mockStore = configureStore({
  reducer: rootReducer,
})

export const persistor = persistStore(store)
