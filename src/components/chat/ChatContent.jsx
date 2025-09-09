import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { createThread, addMessage } from "@/services/store/slices/chat.slice"
import ct from "@constants/"

import EmptyChatView from "./EmptyChatView"
import MessageView from "./MessageView"

/**
 * ChatContent component provides the main chat content area (right side)
 */
const ChatContent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { threadId } = useParams()

  const { threads } = useSelector((state) => state[ct.store.CHAT_STORE])

  // Find the active thread
  const activeThread = threadId ? threads.find((t) => t.id === threadId) : null

  const handleNewChat = useCallback(() => {
    const newThread = dispatch(createThread({ title: "New Chat" }))
    navigate(`/chat/${newThread.payload.id || Date.now().toString()}`)
  }, [dispatch, navigate])

  const handleSendMessage = useCallback(
    (message) => {
      console.log("message", message)
      // If no active thread, create a new one
      if (!activeThread) {
        const newThread = dispatch(
          createThread({ title: message.slice(0, 50) + "..." })
        )
        const threadId = newThread.payload.id || Date.now().toString()

        // Add the message to the new thread
        dispatch(
          addMessage({
            threadId,
            message: {
              id: Date.now().toString(),
              content: message,
              role: "user",
              timestamp: new Date().toISOString(),
            },
          })
        )

        navigate(`/chat/${threadId}`)
      } else {
        // Add message to existing thread
        dispatch(
          addMessage({
            threadId: activeThread.id,
            message: {
              id: Date.now().toString(),
              content: message,
              role: "user",
              timestamp: new Date().toISOString(),
            },
          })
        )
      }
    },
    [dispatch, navigate, activeThread]
  )

  return (
    <div className="flex flex-col h-full">
      {activeThread ? (
      <>
        <MessageView thread={activeThread} />
      </>
      ) : (
        <EmptyChatView
          onNewChat={handleNewChat}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  )
}

export default ChatContent
