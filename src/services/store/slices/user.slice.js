import { createSlice } from "@reduxjs/toolkit"

import { queryClient } from "@/lib/queryClient"
import ct from "@constants/"

export const authSlice = createSlice({
  name: ct.store.USER_STORE,
  initialState: {
    userName: "",
    isAuthenticated: false,
    userRole: "",
  },
  reducers: {
    login: (state, action) => {
      state.userName = action.payload.userName
      state.isAuthenticated = true
      state.userRole = action.payload.userRole
    },
    logout: (state) => {
      state.userName = ""
      state.isAuthenticated = false
      state.userRole = ""

      // also clear localhost
      queryClient.clear()
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
