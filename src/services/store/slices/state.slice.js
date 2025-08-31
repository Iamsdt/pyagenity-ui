import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { pingBackend, fetchGraphData } from "@api/setupIntegration.api"
import ct from "@constants/"

// list of messages
// message example
// { message_id: 1, content: "Hello, world!", role: "user"}
const initialState = {
  isLoading: false,
  error: null,
  state: {
    context: [],
    contextSummary: "",
    execution_meta: {
      current_node: "",
      step: 0,
      status: "idle",
      interrupted_node: [],
      interrupt_reason: "",
      interrupt_data: [],
      thread_id: "",
      internal_data: {},
    },
  },
}

export const fetchStateScheme = createAsyncThunk(
  "state/fetchStateScheme",
  async ({ backendUrl, authToken }, { rejectWithValue }) => {
    try {
      const result = await pingBackend(backendUrl, authToken)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const stateSlice = createSlice({
  name: ct.store.STATE_STORE,
  initialState,
  reducers: {
    updateState: (state, action) => {
      const { context, contextSummary, execution_meta } = action.payload
      state.context = context || state.context
      state.contextSummary = contextSummary || state.contextSummary
      state.execution_meta = execution_meta || state.execution_meta
    },
    clearSettings: (state) => {
      state.context = []
      state.contextSummary = ""
      state.execution_meta = initialState.execution_meta
      state.isBackendConfigured = false
    },
    addNewMessage: (state, action) => {
      const { message } = action.payload
      state.context.push(message)
    },
  },
  extraReducers: (builder) => {
    builder
      // Ping endpoint async thunk
      .addCase(fetchStateScheme.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchStateScheme.fulfilled, (state, action) => {
        // this api will return current state schema, which we can use to update our state
        state.state = action.payload
        state.isLoading = false
      })
      .addCase(fetchStateScheme.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Fetch failed"
      })
  },
})
