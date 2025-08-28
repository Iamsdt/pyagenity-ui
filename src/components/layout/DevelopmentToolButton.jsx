import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * DevelopmentToolButton component renders a development tool button with tooltip
 * @param {object} props - Component props
 * @param {Function} props.icon - Lucide icon component
 * @param {string} props.tooltip - Tooltip text to display
 * @param {Function} props.handleActivate - Function called when button is clicked
 * @param {boolean} props.isActive - Whether the button is currently active
 * @param {boolean} props.disabled - Whether the button is disabled
 * @returns {object} Development tool button with icon and tooltip
 */
const DevelopmentToolButton = ({
  icon: Icon,
  tooltip,
  handleActivate,
  isActive,
  disabled = false,
}) => {
  const handleClick = disabled ? undefined : handleActivate

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          disabled={disabled}
          className={`h-8 w-8 p-0 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-slate-100 dark:hover:bg-slate-800"
          } ${isActive && !disabled ? "bg-slate-100 dark:bg-slate-800" : ""}`}
          aria-label={tooltip}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{disabled ? "Configure backend URL in Settings first" : tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

DevelopmentToolButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  tooltip: PropTypes.string.isRequired,
  handleActivate: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
}

DevelopmentToolButton.defaultProps = {
  disabled: false,
}

export default DevelopmentToolButton
