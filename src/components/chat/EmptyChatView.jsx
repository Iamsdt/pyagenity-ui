import { Send, Sparkles, Paperclip } from "lucide-react"
import PropTypes from "prop-types"
import { useState, useRef } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShineBorder } from "@/components/magicui/shine-border"
import ct from "@constants/"

/**
 * EmptyChatView component displays when no thread is selected or active thread has no messages
 * Styled to match Claude's clean and modern empty state design
 */
const EmptyChatView = ({ onNewChat, onSendMessage }) => {
  const [message, setMessage] = useState("")
  const fileInputRef = useRef(null)

  const store = useSelector((state) => state[ct.store.SETTINGS_STORE])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage?.(message.trim())
      setMessage("")
    }
  }

  const handleFileAttach = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Start new chat with file attachment
      onNewChat()
      // Here you could handle file processing and add to the new chat
      console.log("Files selected:", files)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with logo and greeting */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold ml-3 text-foreground">
              {store.name && store.name.length > 0 ? (
                <span>{store.name}</span>
              ) : (
                <span>PyAgenity</span>
              )}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by AI Intelligence
          </p>
        </div>

        {/* Large input area with shine border */}
        <div className="w-full max-w-3xl mb-8 relative">
          <Card className="relative overflow-hidden">
            <ShineBorder
              shineColor={["#60A5FA", "#8B5CF6", "#F59E0B"]}
              borderWidth={1}
              duration={8}
              className="rounded-lg"
            />
            <form onSubmit={handleSubmit}>
              <CardContent className="p-0">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here to start a new chat..."
                  className="w-full h-32 px-6 py-4 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/10">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleFileAttach}
                      className="h-8 w-8 p-0 hover:bg-accent"
                      title="Attach files to start new chat"
                    >
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.csv,.json"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!message.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <span className="text-sm font-medium text-foreground">
              Resources
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  <span className="text-sm font-medium text-foreground group-hover:text-blue-600">
                    PyAgenity Documentation
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  <span className="text-sm font-medium text-foreground group-hover:text-blue-600">
                    PyAgenity Deployment Guide
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  <span className="text-sm font-medium text-foreground group-hover:text-blue-600">
                    PyAgenity Prompt Library
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

EmptyChatView.propTypes = {
  onNewChat: PropTypes.func,
  onSendMessage: PropTypes.func,
}

export default EmptyChatView
