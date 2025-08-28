import { GitGraph } from "lucide-react"
import PropTypes from "prop-types"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/**
 * ViewGraphSheet component displays network graph visualization
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the sheet is open
 * @param {Function} props.onClose - Function to close the sheet
 * @returns {object} Sheet component displaying network graph
 */
const ViewGraphSheet = ({ isOpen, onClose }) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Network Graph</SheetTitle>
          <SheetDescription>
            Visualize application flow and network connections
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 h-full">
          <div className="h-full border rounded-lg dark:border-slate-700 p-4">
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <GitGraph className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Graph visualization will be rendered here</p>
                <p className="text-sm mt-2">
                  Connect nodes, edges, and data flow
                </p>
              </div>
            </div>
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
