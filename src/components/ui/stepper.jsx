import React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Professional Stepper Component
 *
 * A modern, accessible stepper component built with Shadcn UI principles.
 * Features:
 * - Step indicators with status (pending, loading, success, error)
 * - Professional visual design with animations
 * - Keyboard navigation support
 * - Responsive layout
 * - Error state handling
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects { label, description? }
 * @param {number} props.currentStep - Current active step (0-indexed)
 * @param {Object} props.stepStatus - Status object for each step { [stepIndex]: { loading, error, completed } }
 * @param {Function} props.onStepClick - Callback when step is clicked (optional)
 * @param {string} props.className - Additional CSS classes
 */
const Stepper = React.memo(
  ({
    steps = [],
    currentStep = 0,
    stepStatus = {},
    onStepClick,
    className,
    ...props
  }) => {
    if (!steps || steps.length === 0) {
      return null
    }

    /**
     * Get the status of a specific step
     * @param {number} stepIndex
     * @returns {Object} Status object
     */
    const getStepStatus = (stepIndex) => {
      const status = stepStatus[stepIndex] || {}
      return {
        loading: status.loading || false,
        error: status.error || null,
        completed: status.completed || false,
        isActive: stepIndex === currentStep,
        isPast: stepIndex < currentStep,
        isFuture: stepIndex > currentStep,
      }
    }

    /**
     * Handle step click
     * @param {number} stepIndex
     */
    const handleStepClick = (stepIndex) => {
      if (onStepClick && typeof onStepClick === "function") {
        onStepClick(stepIndex)
      }
    }

    /**
     * Get step indicator content based on status
     * @param {number} stepIndex
     * @param {Object} status
     */
    const getStepIndicator = (stepIndex, status) => {
      if (status.loading) {
        return <Loader2 className="h-4 w-4 animate-spin" />
      }

      if (status.error) {
        return <AlertCircle className="h-4 w-4" />
      }

      if (status.completed) {
        return <Check className="h-4 w-4" />
      }

      return <span className="text-sm font-medium">{stepIndex + 1}</span>
    }

    /**
     * Get step indicator styles based on status
     * @param {Object} status
     */
    const getStepIndicatorStyles = (status) => {
      if (status.loading) {
        return "border-blue-500 bg-blue-50 text-blue-600"
      }

      if (status.error) {
        return "border-red-500 bg-red-50 text-red-600"
      }

      if (status.completed) {
        return "border-green-500 bg-green-500 text-white"
      }

      if (status.isActive) {
        return "border-blue-500 bg-blue-500 text-white"
      }

      if (status.isPast) {
        return "border-gray-300 bg-gray-100 text-gray-500"
      }

      return "border-gray-300 bg-white text-gray-400"
    }

    /**
     * Get step label styles based on status
     * @param {Object} status
     */
    const getStepLabelStyles = (status) => {
      if (status.error) {
        return "text-red-600 font-medium"
      }

      if (status.completed) {
        return "text-green-600 font-medium"
      }

      if (status.isActive) {
        return "text-blue-600 font-medium"
      }

      if (status.loading) {
        return "text-blue-600 font-medium"
      }

      return "text-gray-600"
    }

    return (
      <div className={cn("w-full", className)} {...props}>
        <nav
          aria-label="Progress"
          className="flex items-center justify-between"
        >
          {steps.map((step, stepIndex) => {
            const status = getStepStatus(stepIndex)
            const isLast = stepIndex === steps.length - 1
            const isClickable = onStepClick && !status.loading

            return (
              <div key={stepIndex} className="flex items-center flex-1">
                {/* Step Indicator */}
                <div className="flex flex-col items-center min-w-0">
                  <button
                    type="button"
                    onClick={() => isClickable && handleStepClick(stepIndex)}
                    disabled={!isClickable}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                      getStepIndicatorStyles(status),
                      isClickable && "hover:scale-105 cursor-pointer",
                      !isClickable && "cursor-default"
                    )}
                    aria-current={status.isActive ? "step" : undefined}
                    aria-label={`Step ${stepIndex + 1}: ${step.label}`}
                  >
                    {getStepIndicator(stepIndex, status)}
                  </button>

                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        "text-sm transition-colors duration-200",
                        getStepLabelStyles(status)
                      )}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-xs text-gray-500">
                        {step.description}
                      </p>
                    )}
                    {status.error && (
                      <p className="mt-1 text-xs text-red-500 max-w-32 break-words">
                        {typeof status.error === "string"
                          ? status.error
                          : "Error occurred"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 mx-4 h-0.5 bg-gray-200 relative">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        status.completed || stepIndex < currentStep
                          ? "bg-green-500"
                          : status.isActive
                            ? "bg-blue-500 w-1/2"
                            : "bg-gray-200"
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    )
  }
)

Stepper.displayName = "Stepper"

export default Stepper

/**
 * Hook for managing stepper state
 * @param {number} totalSteps
 * @param {number} initialStep
 */
export const useStepper = (totalSteps, initialStep = 0) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep)
  const [stepStatus, setStepStatus] = React.useState({})

  const goToStep = React.useCallback(
    (step) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step)
      }
    },
    [totalSteps]
  )

  const nextStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prevStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const setStepLoading = React.useCallback((step, loading = true) => {
    setStepStatus((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        loading,
        error: loading ? null : prev[step]?.error,
      },
    }))
  }, [])

  const setStepError = React.useCallback((step, error) => {
    setStepStatus((prev) => ({
      ...prev,
      [step]: { ...prev[step], error, loading: false, completed: false },
    }))
  }, [])

  const setStepCompleted = React.useCallback((step, completed = true) => {
    setStepStatus((prev) => ({
      ...prev,
      [step]: { ...prev[step], completed, loading: false, error: null },
    }))
  }, [])

  const resetStep = React.useCallback((step) => {
    setStepStatus((prev) => ({
      ...prev,
      [step]: { loading: false, error: null, completed: false },
    }))
  }, [])

  const resetAllSteps = React.useCallback(() => {
    setStepStatus({})
    setCurrentStep(initialStep)
  }, [initialStep])

  return {
    currentStep,
    stepStatus,
    goToStep,
    nextStep,
    prevStep,
    setStepLoading,
    setStepError,
    setStepCompleted,
    resetStep,
    resetAllSteps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  }
}
