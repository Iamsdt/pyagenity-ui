import PropTypes from "prop-types"

import ConversationSidebar from "./components/ConversationSidebar"
import ChatHeader from "./components/ChatHeader"
import ChatMessages from "./components/ChatMessages"

/**
 * ChatUI component renders the complete chat interface
 */
const ChatUI = ({
  conversations,
  selectedConversation,
  messages,
  isLoading,
  userName,
  onSendMessage,
  onNewChat,
  onSelectConversation,
  onReset,
}) => {
  const selectedConversationData = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Conversation History */}
      <ConversationSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onNewChat={onNewChat}
        onSelectConversation={onSelectConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header with User Menu */}
        <ChatHeader
          title={selectedConversationData?.title}
          userName={userName}
          onReset={onReset}
        />

        {/* Messages and Input Area */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  )
}

ChatUI.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      lastMessage: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedConversation: PropTypes.number,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      sender: PropTypes.oneOf(["user", "ai"]).isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  onSendMessage: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

ChatUI.defaultProps = {
  selectedConversation: null,
  userName: null,
}

export default ChatUI