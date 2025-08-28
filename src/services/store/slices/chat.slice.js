import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    threads: [],
    activeThreadId: null,
    isLoading: false,
    error: null,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.isLoading = false
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
            state.activeThreadId = action.payload
        },
        addMessage: (state, action) => {
            const { threadId, message } = action.payload
            const thread = state.threads.find((t) => t.id === threadId)
            if (thread) {
                const newMessage = {
                    id: Date.now().toString(),
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
})

export const {
    setLoading,
    setError,
    createThread,
    setActiveThread,
    addMessage,
    updateMessage,
    deleteThread,
    updateThreadTitle,
    clearMessages,
} = chatSlice.actions

export default chatSlice.reducer
