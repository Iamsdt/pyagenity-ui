import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { updateFullState } from "@/services/store/slices/state.slice"
import ct from "@constants/"
import { fetchState, putState, deleteState } from "@/services/api/state.api"
import { useToast } from "@/components/ui/use-toast"


/**
 * Helper component for managing array fields
 */
const ArrayField = ({
  label,
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  itemPlaceholder,
}) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <Label className="text-xs">{label}</Label>
      <Button size="sm" onClick={onAdd}>
        Add {label}
      </Button>
    </div>
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={`${label}-${index}`} className="flex gap-2">
          <Input
            value={item}
            onChange={(event) => onUpdate(index, event.target.value)}
            placeholder={itemPlaceholder}
          />
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(index)}
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  </div>
)

ArrayField.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  itemPlaceholder: PropTypes.string,
}

/**
 * Helper component for context message management
 */
const ContextMessage = ({ message, index, onUpdate, onRemove }) => (
  <div className="border rounded p-3 space-y-3">
    <div className="flex justify-between items-center">
      <Label className="text-xs font-medium">Message {index + 1}</Label>
      <Button size="sm" variant="destructive" onClick={onRemove}>
        Remove
      </Button>
    </div>

    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Message ID</Label>
          <Input
            value={message.message_id || ""}
            onChange={(event) => {
              const newMessage = {
                ...message,
                message_id: parseInt(event.target.value) || 0,
              }
              onUpdate(newMessage)
            }}
            placeholder="Message ID"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Role</Label>
          <Input
            value={message.role || ""}
            onChange={(event) => {
              const newMessage = {
                ...message,
                role: event.target.value,
              }
              onUpdate(newMessage)
            }}
            placeholder="user/assistant"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Content</Label>
        <textarea
          value={message.content || ""}
          onChange={(event) => {
            const newMessage = {
              ...message,
              content: event.target.value,
            }
            onUpdate(newMessage)
          }}
          placeholder="Message content"
          className="w-full mt-1 p-2 border rounded-md bg-background text-sm min-h-[60px] resize-vertical"
          rows={3}
        />
      </div>
    </div>
  </div>
)

ContextMessage.propTypes = {
  message: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

/**
 * Custom hook for form data management
 */
const useFormData = (stateData) => {
  const [formData, setFormData] = useState({
    context: [],
    context_summary: "",
    execution_meta: {
      current_node: "",
      step: 0,
      status: "idle",
      interrupted_node: [],
      interrupt_reason: "",
      interrupt_data: [],
      thread_id: "",
      internal_data: {},
    },
  })

  useEffect(() => {
    if (stateData) {
      const normalized = stateData?.data?.state ?? stateData?.state ?? stateData
      setFormData((previousData) => ({ ...previousData, ...normalized }))
    }
  }, [stateData])

  const updateField = (path, value) => {
    const newFormData = { ...formData }
    const keys = path.split(".")
    let current = newFormData

    for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++) {
      if (!current[keys[keyIndex]]) current[keys[keyIndex]] = {}
      current = current[keys[keyIndex]]
    }
    current[keys[keys.length - 1]] = value
    setFormData(newFormData)
  }

  const updateNumberField = (path, value) => {
    const numberValue = parseInt(value) || 0
    updateField(path, numberValue)
  }

  const updateArrayItem = (path, itemIndex, value) => {
    const newFormData = { ...formData }
    const keys = path.split(".")
    let current = newFormData

    for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++) {
      current = current[keys[keyIndex]]
    }
    const arrayField = keys[keys.length - 1]
    current[arrayField][itemIndex] = value
    setFormData(newFormData)
  }

  const addArrayItem = (path, item = "") => {
    const newFormData = { ...formData }
    const keys = path.split(".")
    let current = newFormData

    for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++) {
      current = current[keys[keyIndex]]
    }
    const arrayField = keys[keys.length - 1]
    if (!current[arrayField]) current[arrayField] = []
    current[arrayField].push(item)
    setFormData(newFormData)
  }

  const removeArrayItem = (path, itemIndex) => {
    const newFormData = { ...formData }
    const keys = path.split(".")
    let current = newFormData

    for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++) {
      current = current[keys[keyIndex]]
    }
    const arrayField = keys[keys.length - 1]
    current[arrayField].splice(itemIndex, 1)
    setFormData(newFormData)
  }

  return {
    formData,
    updateField,
    updateNumberField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  }
}

/**
 * ViewStateSheet component displays application state information
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the sheet is open
 * @param {Function} props.onClose - Function to close the sheet
 * @returns {object} Sheet component displaying application state
 */
// eslint-disable-next-line max-lines-per-function, complexity
const ViewStateSheet = ({ isOpen, onClose, threadId }) => {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Fetch state when the sheet opens and a threadId is available
  useEffect(() => {
    if (!isOpen || !threadId) return
    
    const run = async () => {
      try {
        console.log("📌 Fetching state for thread:", threadId)
        const res = await fetchState(threadId)
        console.log("✅ API response:", res.data)
        const statePayload = res?.data?.data?.state ?? res?.data?.state ?? res?.data
        dispatch(updateFullState(statePayload))
      } catch (err) {
        console.error("❌ Failed to fetch state:", err)
      }
    }
    run()
  }, [isOpen, threadId, dispatch])
  const stateData = useSelector((state) => state[ct.store.STATE_STORE].state)
  const [isContextOpen, setIsContextOpen] = useState(true)
  const [isExecutionMetaOpen, setIsExecutionMetaOpen] = useState(true)

  const {
    formData,
    updateField,
    updateNumberField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  } = useFormData(stateData)

  const handleSave = () => {
    dispatch(updateFullState(formData))
  }

  const handleSync = async () => {
    try {
      const idToPut = threadId || formData.execution_meta?.thread_id
      if (!idToPut) {
        console.warn("No thread ID available to sync state")
        return
      }
  
      // Wrap formData in 'state' field as backend expects
      const requestBody = { state: formData }
      
      // PUT current formData to backend
      const response = await putState(idToPut, requestBody)
      const updatedState = response?.data?.data?.state ?? response?.data?.state ?? response?.data

      // Update redux with backend-confirmed state (only the state)
      dispatch(updateFullState(updatedState))
  
      console.log("PUT state for thread:", idToPut, updatedState)
    } catch (error) {
      console.error("Failed to put state:", error)
    }
  }

  const handleDeleteState = async () => {
    try {
      setIsDeleting(true)
      await deleteState(threadId)
      toast({
        title: "Success",
        description: "Thread state deleted successfully"
      })
    } catch (error) {
      console.error("Delete state error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete thread state"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleContextUpdate = (messageIndex, newMessage) => {
    updateArrayItem("context", messageIndex, newMessage)
  }

  const addNewMessage = () => {
    addArrayItem("context", {
      message_id: Date.now(),
      content: "",
      role: "user",
    })
  }

  const dynamicFields = Object.keys(formData).filter(
    (key) =>
      ![
        "context",
        "context_summary",
        "execution_meta",
        // exclude API envelope keys if present
        "data",
        "metadata",
        "state",
      ].includes(key)
  )

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Application State</SheetTitle>
          <SheetDescription>
            View and edit the current application state
          </SheetDescription>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSync}>
              Sync State
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 pr-4">
              {/* Context Summary Field */}
              <Card className="p-4">
                <Label
                  htmlFor="context_summary"
                  className="text-sm font-medium"
                >
                  Context Summary
                </Label>
                <textarea
                  id="context_summary"
                  value={formData.context_summary || ""}
                  onChange={(event) =>
                    updateField("context_summary", event.target.value)
                  }
                  placeholder="Enter context summary"
                  className="w-full mt-2 p-2 border rounded-md bg-background text-sm min-h-[80px] resize-vertical"
                  rows={4}
                />
              </Card>

              {/* Context Messages Array - Collapsible */}
              <Card className="p-4">
                <Collapsible
                  open={isContextOpen}
                  onOpenChange={setIsContextOpen}
                >
                  <CollapsibleTrigger className="flex w-full justify-between items-center mb-3">
                    <Label className="text-sm font-medium">
                      Context Messages ({(formData.context || []).length})
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={addNewMessage}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {isContextOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3">
                      {(formData.context || []).map((message, messageIndex) => (
                        <ContextMessage
                          key={`message-${message.message_id || messageIndex}`}
                          message={message}
                          index={messageIndex}
                          onUpdate={(newMessage) =>
                            handleContextUpdate(messageIndex, newMessage)
                          }
                          onRemove={() =>
                            removeArrayItem("context", messageIndex)
                          }
                        />
                      ))}
                      {(formData.context || []).length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          No messages yet. Click "Add Message" to start.
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Execution Metadata - Collapsible */}
              <Card className="p-4">
                <Collapsible
                  open={isExecutionMetaOpen}
                  onOpenChange={setIsExecutionMetaOpen}
                >
                  <CollapsibleTrigger className="flex w-full justify-between items-center mb-3">
                    <Label className="text-sm font-medium">
                      Execution Metadata
                    </Label>

                    <Button variant="ghost" size="sm">
                      {isExecutionMetaOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-4">
                      {/* Current Node - Editable */}
                      <div>
                        <Label htmlFor="current_node" className="text-xs">
                          Current Node
                        </Label>
                        <textarea
                          id="current_node"
                          value={formData.execution_meta?.current_node || ""}
                          onChange={(event) =>
                            updateField(
                              "execution_meta.current_node",
                              event.target.value
                            )
                          }
                          placeholder="Current node"
                          className="w-full mt-1 p-2 border rounded-md bg-background text-sm min-h-[60px] resize-vertical"
                          rows={3}
                        />
                      </div>

                      {/* Read-only fields */}
                      <div className="grid gap-3">
                        <div>
                          <Label htmlFor="status" className="text-xs">
                            Status (Read-only)
                          </Label>
                          <Input
                            id="status"
                            value={formData.execution_meta?.status || ""}
                            disabled
                            placeholder="Status"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="step" className="text-xs">
                            Step (Read-only)
                          </Label>
                          <Input
                            id="step"
                            type="number"
                            value={formData.execution_meta?.step || 0}
                            disabled
                            placeholder="Step number"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="thread_id" className="text-xs">
                            Thread ID (Read-only)
                          </Label>
                          <Input
                            id="thread_id"
                            value={formData.execution_meta?.thread_id || ""}
                            disabled
                            placeholder="Thread ID"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="interrupt_reason" className="text-xs">
                            Interrupt Reason (Read-only)
                          </Label>
                          <textarea
                            id="interrupt_reason"
                            value={
                              formData.execution_meta?.interrupt_reason || ""
                            }
                            disabled
                            placeholder="Interrupt reason"
                            className="w-full mt-1 p-2 border rounded-md bg-muted text-sm min-h-[60px] resize-vertical opacity-60"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Array fields - Read-only */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs font-medium">
                            Interrupted Nodes (Read-only)
                          </Label>
                          <div className="space-y-1 mt-2">
                            {(
                              formData.execution_meta?.interrupted_node || []
                            ).map((node, nodeIndex) => (
                              <Input
                                key={`interrupted-${nodeIndex}`}
                                value={node}
                                disabled
                                className="bg-muted opacity-60"
                              />
                            ))}
                            {(formData.execution_meta?.interrupted_node || [])
                              .length === 0 && (
                              <div className="text-xs text-muted-foreground p-2 border rounded-md bg-muted">
                                No interrupted nodes
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs font-medium">
                            Interrupt Data (Read-only)
                          </Label>
                          <div className="space-y-1 mt-2">
                            {(
                              formData.execution_meta?.interrupt_data || []
                            ).map((data, dataIndex) => (
                              <textarea
                                key={`interrupt-data-${dataIndex}`}
                                value={data}
                                disabled
                                className="w-full p-2 border rounded-md bg-muted text-sm min-h-[40px] resize-vertical opacity-60"
                                rows={2}
                              />
                            ))}
                            {(formData.execution_meta?.interrupt_data || [])
                              .length === 0 && (
                              <div className="text-xs text-muted-foreground p-2 border rounded-md bg-muted">
                                No interrupt data
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Dynamic Additional Fields */}
              {dynamicFields.map((fieldKey) => (
                <Card key={fieldKey} className="p-4">
                  <Label className="text-sm font-medium">{fieldKey}</Label>
                  <textarea
                    value={
                      typeof formData[fieldKey] === "string"
                        ? formData[fieldKey]
                        : JSON.stringify(formData[fieldKey])
                    }
                    onChange={(event) => {
                      try {
                        const value =
                          event.target.value.startsWith("{") ||
                          event.target.value.startsWith("[")
                            ? JSON.parse(event.target.value)
                            : event.target.value
                        updateField(fieldKey, value)
                      } catch {
                        updateField(fieldKey, event.target.value)
                      }
                    }}
                    placeholder={`Enter ${fieldKey}`}
                    className="w-full mt-2 p-2 border rounded-md bg-background text-sm min-h-[80px] resize-vertical"
                    rows={4}
                  />
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

ViewStateSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  threadId: PropTypes.string,
}

export default ViewStateSheet
