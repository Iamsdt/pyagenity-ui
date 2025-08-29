import { Network } from "lucide-react"
import PropTypes from "prop-types"
import React from "react"
import { useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { selectGraphData } from "@/services/store/slices/settings.slice"

/**
 * Graph Node Component - displays individual node information
 */
const GraphNode = ({ node }) => {
  const getInputCount = () => {
    if (!node.inputs) return 0
    return Array.isArray(node.inputs)
      ? node.inputs.length
      : Object.keys(node.inputs).length
  }

  const getOutputCount = () => {
    if (!node.outputs) return 0
    return Array.isArray(node.outputs)
      ? node.outputs.length
      : Object.keys(node.outputs).length
  }

  return (
    <Card className="p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {node.id || node.name || "Unknown Node"}
          </h4>
          {node.type && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
              {node.type}
            </span>
          )}
        </div>

        {node.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {node.description}
          </p>
        )}

        {(node.inputs || node.outputs) && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {node.inputs && (
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {"Inputs: "}
                  {getInputCount()}
                </span>
              </div>
            )}
            {node.outputs && (
              <div>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {"Outputs: "}
                  {getOutputCount()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

/**
 * Graph Connection Component
 */
const GraphConnection = ({ connection, index }) => (
  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
    <span className="text-xs font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
      {index + 1}
    </span>
    <span className="text-sm text-gray-700 dark:text-gray-300">
      {connection.from || connection.source}
      {" → "}
      {connection.to || connection.target}
    </span>
    {connection.label && (
      <span className="text-xs text-gray-500 dark:text-gray-400 italic">
        ({connection.label})
      </span>
    )}
  </div>
)

/**
 * Graph Statistics Component
 */
const GraphStats = ({ graphData }) => {
  const nodes = graphData?.nodes || []
  const edges = graphData?.edges || graphData?.connections || []

  const stats = [
    { label: "Nodes", value: nodes.length, color: "text-blue-600" },
    { label: "Connections", value: edges.length, color: "text-green-600" },
    {
      label: "Node Types",
      value: new Set(nodes.map((n) => n.type).filter(Boolean)).size,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Raw Data View Component
 */
const RawDataView = ({ data }) => (
  <Card className="p-4">
    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
      Raw Graph Data
    </h4>
    <ScrollArea className="h-64 w-full">
      <pre className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </ScrollArea>
  </Card>
)

/**
 * Main Graph View Sheet Component
 */
const GraphViewSheet = ({ isOpen, onClose }) => {
  const graphData = useSelector(selectGraphData)

  if (!graphData) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-[600px] sm:w-[800px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Graph Configuration
            </SheetTitle>
            <SheetDescription>
              No graph data available to display
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex items-center justify-center h-64">
            <div className="text-center">
              <Network className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                No graph data found. Please verify your backend connection
                first.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  const nodes = graphData?.nodes || []
  const edges = graphData?.edges || graphData?.connections || []

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[600px] sm:w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Graph Configuration
          </SheetTitle>
          <SheetDescription>
            View your agent graph structure and connections
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Graph Statistics */}
          <GraphStats graphData={graphData} />

          {/* Nodes Section */}
          {nodes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Nodes ({nodes.length})
              </h3>
              <ScrollArea className="h-48 w-full">
                <div className="grid gap-3">
                  {nodes.map((node, index) => (
                    <GraphNode key={node.id || index} node={node} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Connections Section */}
          {edges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Connections ({edges.length})
              </h3>
              <ScrollArea className="h-32 w-full">
                <div className="space-y-2">
                  {edges.map((connection, index) => (
                    <GraphConnection
                      key={`${connection.from || connection.source}-${connection.to || connection.target}-${index}`}
                      connection={connection}
                      index={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Raw Data Section */}
          <RawDataView data={graphData} />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

GraphNode.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    inputs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    outputs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }).isRequired,
}

GraphConnection.propTypes = {
  connection: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
    source: PropTypes.string,
    target: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
}

GraphStats.propTypes = {
  graphData: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
    connections: PropTypes.array,
  }),
}

RawDataView.propTypes = {
  data: PropTypes.object.isRequired,
}

GraphViewSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default GraphViewSheet
