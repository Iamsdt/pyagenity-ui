import { Info, GitBranch, Link, Database, Shield } from "lucide-react"
import PropTypes from "prop-types"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Color constants
const SUCCESS_COLOR = "text-green-600 dark:text-green-400"
const INACTIVE_COLOR = "text-gray-500 dark:text-gray-400"

/**
 * Stats display component
 */
const StatsSection = ({ nodeCount, edgeCount }) => {
  const stats = [
    {
      icon: GitBranch,
      label: "Nodes",
      value: nodeCount,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Link,
      label: "Edges",
      value: edgeCount,
      color: SUCCESS_COLOR,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div key={stat.label} className="text-center">
            <div
              className={`flex items-center justify-center mb-1 ${stat.color}`}
            >
              <IconComponent className="w-4 h-4 mr-1" />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Features display component
 */
const FeaturesSection = ({
  checkpointer,
  checkpointerType,
  publisher,
  store,
}) => {
  const features = [
    {
      icon: Database,
      label: "Checkpointer",
      value: checkpointer,
      type: checkpointerType,
      color: checkpointer ? SUCCESS_COLOR : INACTIVE_COLOR,
    },
    {
      icon: Shield,
      label: "Publisher",
      value: publisher,
      color: publisher ? SUCCESS_COLOR : INACTIVE_COLOR,
    },
    {
      icon: Info,
      label: "Store",
      value: store,
      color: store ? SUCCESS_COLOR : INACTIVE_COLOR,
    },
  ]

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Features</h4>
      {features.map((feature) => {
        const IconComponent = feature.icon
        return (
          <div
            key={feature.label}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <IconComponent className={`w-4 h-4 ${feature.color}`} />
              <span className="text-sm">
                {feature.label}{" "}
                {feature.type && feature.value && (
                  <span className="text-xs text-muted-foreground">
                    ({feature.type})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${feature.color}`}>
                {feature.value ? "✓" : "✗"}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Interrupts display component
 */
const InterruptsSection = ({ interruptBefore, interruptAfter }) => {
  const hasInterrupts = interruptBefore.length > 0 || interruptAfter.length > 0

  if (!hasInterrupts) return null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Interrupts</h4>
      {interruptBefore.length > 0 && (
        <div className="text-xs">
          <span className="font-medium">Before:</span>{" "}
          {interruptBefore.join(", ")}
        </div>
      )}
      {interruptAfter.length > 0 && (
        <div className="text-xs">
          <span className="font-medium">After:</span>{" "}
          {interruptAfter.join(", ")}
        </div>
      )}
    </div>
  )
}

/**
 * Graph Info Panel component displaying metadata about the graph
 * @param {object} props - Component props
 * @param {object} props.graphInfo - Graph metadata information
 * @returns {object} React component displaying graph information
 */
export const GraphInfoPanel = ({ graphInfo }) => {
  const {
    node_count = 0,
    edge_count = 0,
    checkpointer = false,
    checkpointer_type = "None",
    publisher = false,
    store = false,
    interrupt_before = [],
    interrupt_after = [],
  } = graphInfo

  return (
    <Card className="absolute top-4 right-4 z-10 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Info className="w-5 h-5" />
          Graph Info
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <StatsSection nodeCount={node_count} edgeCount={edge_count} />

        <FeaturesSection
          checkpointer={checkpointer}
          checkpointerType={checkpointer_type}
          publisher={publisher}
          store={store}
        />

        <InterruptsSection
          interruptBefore={interrupt_before}
          interruptAfter={interrupt_after}
        />
      </CardContent>
    </Card>
  )
}

// PropTypes for sub-components
StatsSection.propTypes = {
  nodeCount: PropTypes.number.isRequired,
  edgeCount: PropTypes.number.isRequired,
}

FeaturesSection.propTypes = {
  checkpointer: PropTypes.bool.isRequired,
  checkpointerType: PropTypes.string.isRequired,
  publisher: PropTypes.bool.isRequired,
  store: PropTypes.bool.isRequired,
}

InterruptsSection.propTypes = {
  interruptBefore: PropTypes.array.isRequired,
  interruptAfter: PropTypes.array.isRequired,
}

GraphInfoPanel.propTypes = {
  graphInfo: PropTypes.shape({
    node_count: PropTypes.number,
    edge_count: PropTypes.number,
    checkpointer: PropTypes.bool,
    checkpointer_type: PropTypes.string,
    publisher: PropTypes.bool,
    store: PropTypes.bool,
    interrupt_before: PropTypes.array,
    interrupt_after: PropTypes.array,
  }).isRequired,
}

export default GraphInfoPanel
