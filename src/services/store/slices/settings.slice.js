import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { pingBackend, fetchGraphData } from "@api/setupIntegration.api"
import ct from "@constants/"
import { listThreads } from "@api/thread.api"
import { listMessages } from "@/services/api/message.api"

// Async thunks for API testing
export const testPingEndpoint = createAsyncThunk(
  "settings/testPingEndpoint",
  async (_, { rejectWithValue }) => {
    try {
      const result = await pingBackend()
      console.log("#SDT Ping Result:", result)
      return result
    } catch (error) {
      console.error("#SDT Ping error:", error.message)
      return rejectWithValue(error.message)
    }
  }
)
  
export const testGraphEndpoint = createAsyncThunk(
  "settings/testGraphEndpoint",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchGraphData()
      console.log("#SDT Graph Result:", result)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const callListThreadsEndpoint = createAsyncThunk(
  "settings/callListThreadsEndpoint",
  async (_, { getState, rejectWithValue }) => {
    try {
      const result = await listThreads()
      console.log("List Threads Result:", result)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const callGetMessagesEndpoint = createAsyncThunk(
  "settings/callGetMessagesEndpoint",
  async (threadId, { getState, rejectWithValue }) => {
    try {
      const result = await listMessages(threadId)
      console.log("List Messages Result:", result)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  name: "",
  backendUrl: "",
  authToken: "",
  isBackendConfigured: false,
  graphData: null,
  verification: {
    isVerifying: false,
    isVerified: false,
    pingStep: {
      status: "pending",
      errorMessage: "",
    },
    graphStep: {
      status: "pending",
      errorMessage: "",
    },
    lastVerificationTime: null,
  },
}

const settingsSlice = createSlice({
  name: ct.store.SETTINGS_STORE,
  initialState,
  reducers: {
    setSettings: (state, action) => {
      const { name, backendUrl, authToken } = action.payload
      state.name = name || ""
      state.backendUrl = backendUrl || ""
      state.authToken = authToken || ""
      state.isBackendConfigured = false
      // save to local storage
      localStorage.setItem("backendUrl", state.backendUrl)
      localStorage.setItem("authToken", state.authToken)
    },
    clearSettings: (state) => {
      state.name = ""
      state.backendUrl = ""
      state.authToken = ""
      state.isBackendConfigured = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Ping endpoint async thunk
      .addCase(testPingEndpoint.pending, (state) => {
        if (!state.verification) {
          state.verification = initialState.verification
        }
        state.verification.isVerifying = true
        state.verification.pingStep.status = "loading"
        state.verification.pingStep.errorMessage = ""
      })
      .addCase(testPingEndpoint.fulfilled, (state, _) => {
        state.verification.pingStep.status = "success"
        state.verification.pingStep.errorMessage = ""
      })
      .addCase(testPingEndpoint.rejected, (state, action) => {
        state.verification.isVerifying = false
        state.verification.pingStep.status = "error"
        state.verification.pingStep.errorMessage =
          action.payload || "Ping failed"
      })
      // Graph endpoint async thunk
      .addCase(testGraphEndpoint.pending, (state) => {
        state.verification.graphStep.status = "loading"
        state.verification.graphStep.errorMessage = ""
      })
      .addCase(testGraphEndpoint.fulfilled, (state, action) => {
        state.verification.isVerifying = false
        state.verification.graphStep.status = "success"
        state.verification.graphStep.errorMessage = ""
        // also save the data in the state
        state.graphData = action.payload.data.data
        state.verification.isVerified =
          state.verification.pingStep.status === "success"
        state.verification.lastVerificationTime = new Date().toISOString()
      })
      .addCase(testGraphEndpoint.rejected, (state, action) => {
        state.verification.isVerifying = false
        state.verification.graphStep.status = "error"
        state.verification.graphStep.errorMessage =
          action.payload || "Graph fetch failed"
        state.graphData = null
        state.verification.isVerified = false
      })
  },
})

export const {
  setSettings,
  clearSettings,
  startVerification,
  setPingStepResult,
  setGraphStepResult,
  resetVerification,
  saveAndVerifySettings,
} = settingsSlice.actions

export default settingsSlice.reducer
