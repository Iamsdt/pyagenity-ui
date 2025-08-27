import { useState } from "react"
import { 
  Settings, 
  Brain, 
  Database, 
  RotateCcw, 
  Activity,
  ChevronDown
} from "lucide-react"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * ChatHeader component with user options menu
 */
const ChatHeader = ({ title, userName, onReset }) => {
  const [showStateDialog, setShowStateDialog] = useState(false)
  const [showMemoryDialog, setShowMemoryDialog] = useState(false)
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [showEventsDialog, setShowEventsDialog] = useState(false)

  return (
    <>
      <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold animate-in fade-in-50 duration-300">
            {title || "PyAgenity Chat"}
          </h1>
        </div>

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
                onClick={onReset}
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
            {userName?.substring(0, 2).toUpperCase() || "JD"}
          </Button>
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
              <input placeholder="https://api.example.com" className="mt-1 w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium">Auth Token</label>
              <input type="password" placeholder="Enter your auth token" className="mt-1 w-full px-3 py-2 border rounded-md" />
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
            <div className="space-y-2 max-h-48 overflow-auto">
              {[
                { type: "info", message: "User connected", time: new Date() },
                { type: "success", message: "Message sent successfully", time: new Date(Date.now() - 30000) },
                { type: "warning", message: "Rate limit approaching", time: new Date(Date.now() - 60000) },
              ].map((event, index) => (
                <div key={`event-${index}`} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                  <Activity className="h-3 w-3" />
                  <span className="flex-1">{event.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

ChatHeader.propTypes = {
  title: PropTypes.string,
  userName: PropTypes.string,
  onReset: PropTypes.func.isRequired,
}

ChatHeader.defaultProps = {
  title: null,
  userName: null,
}

export default ChatHeader