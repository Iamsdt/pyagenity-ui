import { createSlice } from "@reduxjs/toolkit"

import ct from "@constants/"

const initialState = {
  conversations: [
    {
      id: 1,
      title: "New Chat",
      lastMessage: "Hello! How can I help you today?",
      timestamp: new Date(),
    },
    {
      id: 2,
      title: "API Integration",
      lastMessage: "Let's discuss the API setup...",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 3,
      title: "Data Analysis",
      lastMessage: "Can you analyze this dataset?",
      timestamp: new Date(Date.now() - 7200000),
    },
  ],
  selectedConversation: null,
  messages: [],
  isLoading: false,
}

export const chatSlice = createSlice({
  name: ct.store.CHAT_STORE || "chat",
  initialState,
  reducers: {
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload
      // In real implementation, load messages for this conversation
      state.messages = [
        {
          id: 1,
          content: "Hello! How can I help you today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ]
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    },
  },
})

export const {
  selectConversation,
  addMessage,
  setLoading,
  addConversation,
  clearMessages,
} = chatSlice.actions

export default chatSlice.reducer