import { MessageSquare } from "lucide-react"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"

/**
 * EmptyChatView component displays when no thread is selected or active thread has no messages
 */
const EmptyChatView = ({ onNewChat }) => (
  <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-8 text-center">
    <div className="mb-8">
      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
      <p className="text-muted-foreground">
        Start a conversation with our AI assistant. Ask questions, get help, or
        just chat!
      </p>
    </div>

    <div className="space-y-4 w-full">
      <Button onClick={onNewChat} size="lg" className="w-full">
        Start New Conversation
      </Button>

      <div className="grid grid-cols-1 gap-3 text-left">
        <div className="p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors">
          <h3 className="font-medium mb-1">💡 Get help with coding</h3>
          <p className="text-sm text-muted-foreground">
            Ask for help with programming, debugging, or code reviews
          </p>
        </div>
        <div className="p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors">
          <h3 className="font-medium mb-1">📝 Write and edit text</h3>
          <p className="text-sm text-muted-foreground">
            Get assistance with writing, editing, and improving content
          </p>
        </div>
        <div className="p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors">
          <h3 className="font-medium mb-1">🔍 Research and analyze</h3>
          <p className="text-sm text-muted-foreground">
            Explore topics, analyze data, and get detailed explanations
          </p>
        </div>
      </div>
    </div>
  </div>
)

EmptyChatView.propTypes = {
  onNewChat: PropTypes.func.isRequired,
}

export default EmptyChatView
