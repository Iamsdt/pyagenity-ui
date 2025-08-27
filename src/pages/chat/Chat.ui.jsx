import {
  MessageCircle,
  Plus,
  Send,
  Settings,
  Brain,
  Database,
  RotateCcw,
  Activity,
  ChevronDown,
  User,
  Bot,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/**
 * ChatUI component renders the complete chat interface
 */
const ChatUI = ({
  conversations,
  selectedConversation,
  messages,
  inputMessage,
  isLoading,
  userName,
  onSendMessage,
  onNewChat,
  onSelectConversation,
  onInputChange,
}) => {
  const [showStateDialog, setShowStateDialog] = useState(false)
  const [showMemoryDialog, setShowMemoryDialog] = useState(false)
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [showEventsDialog, setShowEventsDialog] = useState(false)

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSendMessage(inputMessage)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleReset = () => {
    // Clear current conversation
    onSelectConversation(null)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Conversation History */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 animate-in fade-in-50 duration-200"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all duration-200 animate-in slide-in-from-left-5",
                  "hover:bg-accent hover:scale-[1.02] transform",
                  selectedConversation === conversation.id
                    ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                    : "hover:bg-muted"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(conversation.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header with User Menu */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold animate-in fade-in-50 duration-300">
              {selectedConversation
                ? conversations.find((c) => c.id === selectedConversation)
                    ?.title || "Chat"
                : "PyAgenity Chat"}
            </h1>
          </div>

          {/* User Menu with Options */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 animate-in slide-in-from-top-5 duration-300"
                >
                  <Settings className="h-4 w-4" />
                  Options
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setShowStateDialog(true)}
                  className="gap-2 cursor-pointer"
                >
                  <Database className="h-4 w-4" />
                  State
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowMemoryDialog(true)}
                  className="gap-2 cursor-pointer"
                >
                  <Brain className="h-4 w-4" />
                  Memory
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowSetupDialog(true)}
                  className="gap-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  Setup
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleReset}
                  className="gap-2 cursor-pointer text-destructive"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowEventsDialog(true)}
                  className="gap-2 cursor-pointer"
                >
                  <Activity className="h-4 w-4" />
                  Events
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" className="rounded-full">
              {userName?.slice(0, 2).toUpperCase() || "JD"}
            </Button>
          </div>
        </div>

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
                  Ask me anything and I'll help you with your tasks.
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
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
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
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-12 animate-in slide-in-from-bottom-5 duration-300"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => onSendMessage(inputMessage)}
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
      </div>

      {/* Dialogs */}
      <Dialog open={showStateDialog} onOpenChange={setShowStateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Current State
            </DialogTitle>
            <DialogDescription>
              Here you can view the current state data from the API.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
              {`{
  "user": "${userName}",
  "session": "active",
  "context": "chat_interface",
  "last_activity": "${new Date().toISOString()}"
}`}
            </pre>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMemoryDialog} onOpenChange={setShowMemoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Memory
            </DialogTitle>
            <DialogDescription>
              Current memory context for the conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-sm">Short-term Memory</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Last 5 messages in current conversation
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-sm">Long-term Memory</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  User preferences and conversation history
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              API Setup
            </DialogTitle>
            <DialogDescription>
              Configure API connection and authentication tokens.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">API Endpoint</label>
              <Input placeholder="https://api.example.com" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Auth Token</label>
              <Input
                type="password"
                placeholder="Enter your auth token"
                className="mt-1"
              />
            </div>
            <Button className="w-full">Save Configuration</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEventsDialog} onOpenChange={setShowEventsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Realtime Events
            </DialogTitle>
            <DialogDescription>
              Monitor realtime events and system activity.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {[
                  { type: "info", message: "User connected", time: new Date() },
                  {
                    type: "success",
                    message: "Message sent successfully",
                    time: new Date(Date.now() - 30000),
                  },
                  {
                    type: "warning",
                    message: "Rate limit approaching",
                    time: new Date(Date.now() - 60000),
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded text-sm"
                  >
                    <Activity className="h-3 w-3" />
                    <span className="flex-1">{event.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(event.time)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChatUI
