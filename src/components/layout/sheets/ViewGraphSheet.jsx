import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import ct from "@constants"
import GraphInfoPanel from "@/components/graph/GraphInfoPanel"
import ReFlowComponent from "@/components/graph/ReactFlowComponent"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/**
 * ViewGraphSheet component displays network graph visualization using Reagraph
 * Reads graph data directly from Redux store
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the sheet is open
 * @param {Function} props.onClose - Function to close the sheet
 * @returns {object} Sheet component displaying network graph
 */
const ViewGraphSheet = ({ isOpen, onClose }) => {
  // Read graph data directly from Redux store
  const store = useSelector((st) => st[ct.store.SETTINGS_STORE])

  const { graphData } = store

  // Fallback to static data if no API data is available
  const defaultGraphData = {
    info: {
      node_count: 0,
      edge_count: 0,
      checkpointer: false,
      checkpointer_type: "",
      publisher: false,
      store: false,
      interrupt_before: [],
      interrupt_after: [],
    },
    nodes: [],
    edges: [],
  }

  const displayData = graphData || defaultGraphData

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-full">
        <SheetHeader>
          <SheetTitle>Network Graph</SheetTitle>
          <SheetDescription>
            Visualize application flow and network connections
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 h-full relative">
          <div className="h-full relative">
            <ReFlowComponent graphData={displayData} />
            <GraphInfoPanel graphInfo={displayData.info || {}} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

ViewGraphSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ViewGraphSheet
