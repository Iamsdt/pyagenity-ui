import { MessageCircle, Plus } from "lucide-react"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

/**
 * ConversationSidebar component renders the left sidebar with conversation history
 */
const ConversationSidebar = ({ conversations, selectedConversation, onNewChat, onSelectConversation }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleConversationClick = (conversationId) => {
    onSelectConversation(conversationId)
  }

  const handleKeyDown = (event, conversationId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectConversation(conversationId)
    }
  }

  return (
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
              onClick={() => handleConversationClick(conversation.id)}
              onKeyDown={(event) => handleKeyDown(event, conversation.id)}
              role="button"
              tabIndex={0}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-all duration-200 animate-in slide-in-from-left-5",
                "hover:bg-accent hover:scale-[1.02] transform focus:outline-none focus:ring-2 focus:ring-primary",
                selectedConversation === conversation.id
                  ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                  : "hover:bg-muted"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <MessageCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{conversation.title}</h4>
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
  )
}

ConversationSidebar.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      lastMessage: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedConversation: PropTypes.number,
  onNewChat: PropTypes.func.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
}

ConversationSidebar.defaultProps = {
  selectedConversation: null,
}

export default ConversationSidebar