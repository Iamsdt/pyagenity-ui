import { useState } from "react"
import { Send, Bot, User } from "lucide-react"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

/**
 * ChatMessages component renders the messages area with input
 */
const ChatMessages = ({ messages, isLoading, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState("")

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleSubmit = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage)
      setInputMessage("")
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <>
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in-50 duration-500">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Start a conversation
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Ask me anything and I&apos;ll help you with your tasks.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-in slide-in-from-bottom-5 duration-300",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 animate-in slide-in-from-bottom-5 duration-300">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="pr-12 animate-in slide-in-from-bottom-5 duration-300"
                disabled={isLoading}
              />
              <Button
                onClick={handleSubmit}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      sender: PropTypes.oneOf(["user", "ai"]).isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSendMessage: PropTypes.func.isRequired,
}

export default ChatMessages