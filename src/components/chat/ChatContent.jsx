import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { createThread } from "@/services/store/slices/chat.slice"
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

  return (
    <div className="flex flex-col h-full">
      {activeThread ? (
        <MessageView thread={activeThread} />
      ) : (
        <EmptyChatView onNewChat={handleNewChat} />
      )}
    </div>
  )
}

export default ChatContent
