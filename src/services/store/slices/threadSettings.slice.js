import { createSlice } from "@reduxjs/toolkit"

import ct from "@constants/"

const initialState = {
  thread_id: "",
  thread_title: "",
  config: {},
  init_state: {},
  streaming_response: false,
  recursion_limit: 25,
  // readonly data
  context_total_messages: 0,
  context_total_tokens: 0,
  total_messages: 0,
  total_tokens: 0,
  total_tool_calls: 0,
  total_human_messages: 0,
  total_ai_messages: 0,
}

const threadSettingsSlice = createSlice({
  name: ct.store.THREAD_SETTINGS_STORE,
  initialState,
  reducers: {
    setThreadId: (state, action) => {
      state.thread_id = action.payload
    },
    setThreadTitle: (state, action) => {
      state.thread_title = action.payload
    },
    setConfig: (state, action) => {
      state.config = action.payload
    },
    setInitState: (state, action) => {
      state.init_state = action.payload
    },
    setStreamingResponse: (state, action) => {
      state.streaming_response = action.payload
    },
    setRecursionLimit: (state, action) => {
      state.recursion_limit = action.payload
    },
    updateConfigKey: (state, action) => {
      const { key, value } = action.payload
      state.config[key] = value
    },
    removeConfigKey: (state, action) => {
      delete state.config[action.payload]
    },
    updateInitStateKey: (state, action) => {
      const { key, value } = action.payload
      state.init_state[key] = value
    },
    removeInitStateKey: (state, action) => {
      delete state.init_state[action.payload]
    },
    setReadonlyData: (state, action) => {
      const {
        total_messages,
        tool_token,
        total_token,
        total_tool_calls,
        total_human_messages,
        total_ai_messages,
      } = action.payload
      state.total_messages = total_messages || 0
      state.tool_token = tool_token || 0
      state.total_token = total_token || 0
      state.total_tool_calls = total_tool_calls || 0
      state.total_human_messages = total_human_messages || 0
      state.total_ai_messages = total_ai_messages || 0
    },
    resetThreadSettings: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const {
  setThreadId,
  setThreadTitle,
  setConfig,
  setInitState,
  setStreamingResponse,
  setRecursionLimit,
  updateConfigKey,
  removeConfigKey,
  updateInitStateKey,
  removeInitStateKey,
  setReadonlyData,
  resetThreadSettings,
} = threadSettingsSlice.actions

export default threadSettingsSlice.reducer
