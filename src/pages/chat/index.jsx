import { useSelector, useDispatch } from "react-redux"

import ct from "@constants/"
import {
  selectConversation,
  addMessage,
  setLoading,
  addConversation,
  clearMessages,
} from "@store/slices/chat.slice"

import ChatUI from "./Chat.ui"

/**
 * Chat component handles the main chat interface logic
 */
const Chat = () => {
  const dispatch = useDispatch()
  const chatStore = useSelector((st) => st[ct.store.CHAT_STORE || "chat"])
  const userStore = useSelector((st) => st[ct.store.USER_STORE])

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    const newMessage = {
      id: Date.now(),
      content: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    dispatch(addMessage(newMessage))
    dispatch(setLoading(true))

    // Simulate API call
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: "This is a simulated AI response. In the actual implementation, this would come from your API.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      }
      dispatch(addMessage(aiResponse))
      dispatch(setLoading(false))
    }, 1000)
  }

  const handleNewChat = () => {
    const newConversation = {
      id: Date.now(),
      title: "New Chat",
      lastMessage: "",
      timestamp: new Date().toISOString(),
    }
    dispatch(addConversation(newConversation))
    dispatch(selectConversation(newConversation.id))
    dispatch(clearMessages())
  }

  const handleSelectConversation = (conversationId) => {
    dispatch(selectConversation(conversationId))
  }

  const handleReset = () => {
    dispatch(selectConversation(null))
    dispatch(clearMessages())
  }

  return (
    <ChatUI
      conversations={chatStore.conversations}
      selectedConversation={chatStore.selectedConversation}
      messages={chatStore.messages}
      isLoading={chatStore.isLoading}
      userName={userStore.userName}
      onSendMessage={handleSendMessage}
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      onReset={handleReset}
    />
  )
}

export default Chat
