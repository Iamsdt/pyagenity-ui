import PropTypes from "prop-types"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/**
 * ViewStateSheet component displays application state information
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the sheet is open
 * @param {Function} props.onClose - Function to close the sheet
 * @param {string} props.activeSheet - Current active sheet state for debugging
 * @returns {object} Sheet component displaying application state
 */
const ViewStateSheet = ({ isOpen, onClose, activeSheet }) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Application State</SheetTitle>
          <SheetDescription>
            View and inspect the current application state
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg dark:border-slate-700">
              <h3 className="font-medium mb-2">Redux Store</h3>
              <pre className="text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded">
                {JSON.stringify(
                  { theme: "dark", user: "authenticated" },
                  null,
                  2
                )}
              </pre>
            </div>
            <div className="p-4 border rounded-lg dark:border-slate-700">
              <h3 className="font-medium mb-2">Component State</h3>
              <pre className="text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded">
                {JSON.stringify(
                  { activeSheet: activeSheet, loading: false },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

ViewStateSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activeSheet: PropTypes.string,
}

ViewStateSheet.defaultProps = {
  activeSheet: null,
}

export default ViewStateSheet
