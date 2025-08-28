/* eslint-disable no-undef */
import { Bot, Send, User } from "lucide-react"
import PropTypes from "prop-types"
import { useState, useRef, useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addMessage } from "@/services/store/slices/chat.slice"

/**
 * Message component renders individual chat messages
 */
const Message = ({ message }) => {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 p-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : ""}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}

/**
 * MessageInput component handles message composition and sending
 */
const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("")
  const textareaReference = useRef(null)

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      if (message.trim() && !disabled) {
        onSendMessage(message.trim())
        setMessage("")
        if (textareaReference.current) {
          textareaReference.current.style.height = "auto"
        }
      }
    },
    [message, disabled, onSendMessage]
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        handleSubmit(event)
      }
    },
    [handleSubmit]
  )

  const handleTextareaChange = (event) => {
    setMessage(event.target.value)

    // Auto-resize textarea
    const textarea = event.target
    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaReference}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={disabled}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[200px]"
            rows={1}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

/**
 * MessageView component displays the chat interface with messages and input
 */
const MessageView = ({ thread }) => {
  const dispatch = useDispatch()
  const messagesEndReference = useRef(null)
  const [isTyping, setIsTyping] = useState(false)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndReference.current?.scrollIntoView({ behavior: "smooth" })
  }, [thread.messages])

  const handleSendMessage = useCallback(
    async (content) => {
      if (!content.trim()) return

      // Add user message
      dispatch(
        addMessage({
          threadId: thread.id,
          message: { content, role: "user" },
        })
      )

      // Simulate assistant response
      setIsTyping(true)
      setTimeout(() => {
        dispatch(
          addMessage({
            threadId: thread.id,
            message: {
              content:
                "I'm a mock response. This will be replaced with actual AI integration.",
              role: "assistant",
            },
          })
        )
        setIsTyping(false)
      }, 1000)
    },
    [dispatch, thread.id]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="min-h-full">
          {thread.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex gap-3 p-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col max-w-[80%]">
                <div className="rounded-lg px-4 py-2 bg-muted text-muted-foreground">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndReference} />
        </div>
      </ScrollArea>

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    role: PropTypes.oneOf(["user", "assistant"]).isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
}

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

MessageInput.defaultProps = {
  disabled: false,
}

MessageView.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
  }).isRequired,
}

export default MessageView
