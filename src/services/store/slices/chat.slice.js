import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { invokeGraph } from "@api/graph.api" // Adjust path as needed
import { getThread } from "@api/thread.api"  // Add this import
import api from "@api/index" 
import { deleteThread as deleteThreadAPI } from "@api/thread.api"
import { deleteState } from "@/services/api/state.api"

const initialState = {
  threads: [],
  activeThreadId: null,
  isLoading: false,
  isGenerating: false,
  error: null,
}

// Helper function to preserve thread ID as string
const preserveThreadId = (id) => {
  if (id === null || id === undefined) return null
  return typeof id === "string" ? id : id.toString()
}

// Async thunk for sending messages
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ content, threadId }, { dispatch, getState }) => {
    try {
      const state = getState().chat
      let currentThreadId = threadId || state.activeThreadId

      // Create new thread if none exists
      if (!currentThreadId) {
        const newThreadId = Date.now().toString()
        dispatch(createThread({ 
          id: newThreadId, 
          title: content.length > 50 ? `${content.slice(0, 50)}...` : content 
        }))
        currentThreadId = newThreadId
      }

      // Add user message optimistically
      const userMessage = {
        content,
        role: "user",
      }
      dispatch(addMessage({ threadId: currentThreadId, message: userMessage }))
      dispatch(setGenerating(true))

      // Prepare API payload - adjust this based on your GraphInputSchema
      const apiPayload = {
        messages: [
          {role:"user", content: content}
        ],

        response_granularity: "full",
        include_raw: true,
        recursion_limit: 25,
        initial_state: {},
        config: {},
      }

      // Call the API
      const response = await invokeGraph(apiPayload)
      const aiResponseContent = response?.data?.data?.messages[0].content || "Sorry, I couldn't process your message."
      console.log (aiResponseContent)
      // Add AI response message
      const aiMessage = {
        content: aiResponseContent,
        role: "assistant",
      }
      dispatch(addMessage({ threadId: currentThreadId, message: aiMessage }))
      
      dispatch(setGenerating(false))
      return { success: true, threadId: currentThreadId }
      
    } catch (error) {
      console.error("Failed to send message:", error)
      
      // Add error message
      const errorMessage = {
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        role: "assistant",
      }
      dispatch(addMessage({ 
        threadId: threadId || getState().chat.activeThreadId, 
        message: errorMessage 
      }))
      
      dispatch(setError(error.message || "Failed to send message"))
      dispatch(setGenerating(false))
      throw error
    }
  }
)

export const callDeleteThreadEndpoint = createAsyncThunk(
  "chat/deleteThread",
  async (threadId, { rejectWithValue }) => {
    try {
      // First delete the thread state (if it exists)
      try {
        await deleteState(threadId)
        console.log(`Thread state deleted for thread: ${threadId}`)
      } catch (stateError) {
        // Log but don't fail the entire operation if state deletion fails
        // State might not exist for this thread
        console.warn(`Failed to delete state for thread ${threadId}:`, stateError)
      }

      // Then delete the thread itself
      await deleteThreadAPI(threadId)
      console.log(`Thread deleted: ${threadId}`)
      
      return threadId
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
// Add this after the existing sendMessage thunk
export const fetchThread = createAsyncThunk(
  "chat/fetchThread",
  async (threadId, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await getThread(threadId)
      dispatch(setActiveThread(threadId))
      return response.data
    } catch (error) {
      console.error("Failed to fetch thread:", error)
      dispatch(setError(error.message || "Failed to fetch thread"))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setGenerating: (state, action) => {
      state.isGenerating = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
      state.isGenerating = false
    },
    clearError: (state) => {
      state.error = null
    },
    createThread: (state, action) => {
      const newThread = {
        id: action.payload.id || Date.now().toString(),
        title: action.payload.title || "New Chat",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.threads.unshift(newThread)
      state.activeThreadId = newThread.id
    },
    setActiveThread: (state, action) => {
      state.activeThreadId = preserveThreadId(action.payload)
    },
    addMessage: (state, action) => {
      const { threadId, message } = action.payload
      const thread = state.threads.find((t) => t.id === threadId)
      if (thread) {
        const newMessage = {
          id: Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9),
          content: message.content,
          role: message.role, // 'user' or 'assistant'
          timestamp: new Date().toISOString(),
        }
        thread.messages.push(newMessage)
        thread.updatedAt = new Date().toISOString()

        // Update thread title with first user message if it's still "New Chat"
        if (thread.title === "New Chat" && message.role === "user") {
          thread.title =
            message.content.length > 50
              ? `${message.content.slice(0, 50)}...`
              : message.content
        }
      }
    },
    updateMessage: (state, action) => {
      const { threadId, messageId, content } = action.payload
      const thread = state.threads.find((t) => t.id === threadId)
      if (thread) {
        const message = thread.messages.find((m) => m.id === messageId)
        if (message) {
          message.content = content
          message.timestamp = new Date().toISOString()
          thread.updatedAt = new Date().toISOString()
        }
      }
    },
    deleteThread: (state, action) => {
      const threadId = action.payload
      state.threads = state.threads.filter((t) => t.id !== threadId)
      if (state.activeThreadId === threadId) {
        state.activeThreadId =
          state.threads.length > 0 ? state.threads[0].id : null
      }
    },
    updateThreadTitle: (state, action) => {
      const { threadId, title } = action.payload
      const thread = state.threads.find((t) => t.id === threadId)
      if (thread) {
        thread.title = title
        thread.updatedAt = new Date().toISOString()
      }
    },
    clearMessages: (state, action) => {
      const threadId = action.payload
      const thread = state.threads.find((t) => t.id === threadId)
      if (thread) {
        thread.messages = []
        thread.updatedAt = new Date().toISOString()
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to send message"
      })
      .addCase(fetchThread.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchThread.fulfilled, (state, action) => {
        state.isLoading = false
        // Update thread in state with fetched data
        const index = state.threads.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.threads[index] = {
            ...state.threads[index],
            ...action.payload
          }
        }
      })
      .addCase(fetchThread.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch thread"
      })
      .addCase(callDeleteThreadEndpoint.fulfilled, (state, action) => {
      state.threads = state.threads.filter(t => t.id !== action.payload)
      if (state.activeThreadId === action.payload) {
        state.activeThreadId = null
      }
    })
    .addCase(callDeleteThreadEndpoint.rejected, (state, action) => {
      state.error = action.payload || "Failed to delete thread"
    })
  },
})

export const {
  setLoading,
  setGenerating,
  setError,
  clearError,
  createThread,
  setActiveThread,
  addMessage,
  updateMessage,
  deleteThread,
  updateThreadTitle,
  clearMessages,
} = chatSlice.actions

export default chatSlice.reducer