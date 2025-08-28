import PropTypes from "prop-types"

import GraphInfoPanel from "@/components/graph/GraphInfoPanel"
import ReFlowComponent from "@/components/graph/ReactFlowComponent"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import graphData from "@/data/graph.json"

/**
 * ViewGraphSheet component displays network graph visualization using Reagraph
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the sheet is open
 * @param {Function} props.onClose - Function to close the sheet
 * @returns {object} Sheet component displaying network graph
 */
const ViewGraphSheet = ({ isOpen, onClose }) => {
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
            <ReFlowComponent graphData={graphData} />
            <GraphInfoPanel graphInfo={graphData.info || {}} />
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
