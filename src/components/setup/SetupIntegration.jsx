/* eslint-disable react/prop-types */
import { CheckCircle, Loader2, Settings, Zap } from "lucide-react"
import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import SetupConfigurationForm from "@/components/setup/SetupConfigurationForm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Stepper from "@/components/ui/stepper"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { validateBackendSetup } from "@/services/api/setupIntegration.api"
import {
  nextStep,
  previousStep,
  resetSetup,
  selectCurrentStep,
  selectIsSetupComplete,
  selectSetupIntegration,
  selectStepValidation,
  setApiVerificationError,
  setApiVerificationSuccess,
  setConfiguration,
  setStepLoading,
  startApiVerification,
} from "@/services/store/slices/setupIntegration.slice"

/**
 * Setup Integration Component
 *
 * Main component that orchestrates the entire setup flow:
 * - Configuration form (step 0)
 * - API validation (step 1)
 * - Success state
 * @param {object} props
 * @param {Function} props.onComplete - Callback when setup is complete
 * @param {Function} props.onCancel - Callback when setup is cancelled
 * @param {string} props.className - Additional CSS classes
 */
const SetupIntegration = React.memo(
  ({ onComplete, onCancel, className, ...properties }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()

    // Redux state
    const setupState = useSelector(selectSetupIntegration)
    const currentStep = useSelector(selectCurrentStep)
    const stepValidation = useSelector(selectStepValidation)
    const isSetupComplete = useSelector(selectIsSetupComplete)

    const { configuration } = setupState

    // Setup steps configuration
    const steps = [
      {
        label: "Configuration",
        description: "Setup backend connection",
      },
      {
        label: "Validation",
        description: "Verify API connectivity",
      },
    ]

    /**
     * Handle configuration form submission
     * @param {object} data - Form data
     */
    const handleConfigurationSubmit = useCallback(
      (data) => {
        dispatch(setConfiguration(data))

        // Auto-advance to validation step
        dispatch(nextStep())

        // Show success toast
        toast({
          title: "Configuration Saved",
          description: "Backend URL and agent name have been configured.",
        })
      },
      [dispatch, toast]
    )

    /**
     * Handle field changes in configuration form
     * @param {string} fieldName - Field name
     * @param {string} value - Field value
     */
    const handleFieldChange = useCallback(
      (fieldName, value) => {
        dispatch(
          setConfiguration({
            ...configuration,
            [fieldName]: value,
          })
        )
      },
      [dispatch, configuration]
    )

    /**
     * Start API validation process
     */
    const handleStartValidation = useCallback(async () => {
      const { backendUrl, agentName } = configuration

      if (!backendUrl || !agentName) {
        toast({
          title: "Configuration Required",
          description: "Please complete the configuration first.",
          variant: "destructive",
        })
        return
      }

      try {
        dispatch(startApiVerification())

        const results = await validateBackendSetup(
          backendUrl,
          null, // No auth token for now
          (step, result) => {
            // Progress callback for real-time updates
            if (result.loading) {
              dispatch(setStepLoading({ step: 1, isLoading: true }))
            }
          }
        )

        // Success - both ping and graph validation passed
        dispatch(
          setApiVerificationSuccess({
            pingResult: results.ping,
            graphResult: results.graph,
          })
        )

        toast({
          title: "Validation Successful",
          description: "Backend connection verified successfully!",
        })

        // Call completion callback
        if (onComplete) {
          onComplete({
            configuration,
            validationResults: results,
          })
        }
      } catch (error) {
        dispatch(
          setApiVerificationError({
            error: error.message,
          })
        )

        toast({
          title: "Validation Failed",
          description: error.message,
          variant: "destructive",
        })
      }
    }, [configuration, dispatch, toast, onComplete])

    /**
     * Handle step navigation
     * @param {number} stepIndex - Target step index
     */
    const handleStepClick = useCallback(
      (stepIndex) => {
        if (stepIndex === 0) {
          dispatch(previousStep())
        }
        // Can't skip validation step
      },
      [dispatch]
    )

    /**
     * Reset entire setup flow
     */
    const handleReset = useCallback(() => {
      dispatch(resetSetup())
      toast({
        title: "Setup Reset",
        description: "Setup has been reset. You can start over.",
      })
    }, [dispatch, toast])

    /**
     * Handle cancel action
     */
    const handleCancel = useCallback(() => {
      if (onCancel) {
        onCancel()
      }
    }, [onCancel])

    // Auto-start validation when moving to step 1
    useEffect(() => {
      if (
        currentStep === 1 &&
        !stepValidation[1].isLoading &&
        !isSetupComplete
      ) {
        handleStartValidation()
      }
    }, [currentStep, stepValidation, isSetupComplete, handleStartValidation])

    /**
     * Render step content based on current step
     */
    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return (
            <SetupConfigurationForm
              initialValues={configuration}
              onSubmit={handleConfigurationSubmit}
              onFieldChange={handleFieldChange}
              isLoading={stepValidation[0].isLoading}
              error={stepValidation[0].error}
            />
          )

        case 1:
          return <ValidationStep />

        default:
          return null
      }
    }

    /**
     * Validation Step Component
     */
    const ValidationStep = () => (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isSetupComplete ? "Setup Complete!" : "Validating Connection"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isSetupComplete
              ? "Your backend integration is ready to use"
              : "Verifying backend connectivity and fetching graph data"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Configuration Summary */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Configuration Summary
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <strong>Backend URL:</strong> {configuration.backendUrl}
              </p>
              <p>
                <strong>Agent Name:</strong> {configuration.agentName}
              </p>
            </div>
          </div>

          {/* Validation Status */}
          <div className="space-y-4">
            <ValidationStatusItem
              title="Backend Connectivity"
              description="Testing connection to your backend server"
              status={getValidationStatus("ping")}
            />
            <ValidationStatusItem
              title="Graph Data"
              description="Fetching graph structure and data"
              status={getValidationStatus("graph")}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {isSetupComplete ? (
              <Button onClick={() => onComplete?.()} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Setup
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => dispatch(previousStep())}
                  disabled={stepValidation[1].isLoading}
                >
                  Back to Configuration
                </Button>
                <Button
                  onClick={handleStartValidation}
                  disabled={stepValidation[1].isLoading}
                  className="flex-1"
                >
                  {stepValidation[1].isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Retry Validation
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Error Display */}
          {stepValidation[1].error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              <strong>Validation Error:</strong> {stepValidation[1].error}
            </div>
          )}
        </CardContent>
      </Card>
    )

    /**
     * Get validation status for a specific check
     * @param {string} checkType - Type of validation check
     * @returns {object} Status object
     */
    const getValidationStatus = (checkType) => {
      const step1 = stepValidation[1]

      if (step1.isLoading) {
        return { type: "loading", message: "Checking..." }
      }

      if (step1.error) {
        return { type: "error", message: "Failed" }
      }

      if (checkType === "ping" && step1.pingResult) {
        return { type: "success", message: "Connected" }
      }

      if (checkType === "graph" && step1.graphResult) {
        return { type: "success", message: "Data fetched" }
      }

      return { type: "pending", message: "Pending" }
    }

    return (
      <div
        className={cn("w-full max-w-4xl mx-auto p-6", className)}
        {...properties}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            App Integration Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your backend connection and validate API access
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            stepStatus={{
              0: {
                completed: stepValidation[0].isValid,
                loading: stepValidation[0].isLoading,
                error: stepValidation[0].error,
              },
              1: {
                completed: isSetupComplete,
                loading: stepValidation[1].isLoading,
                error: stepValidation[1].error,
              },
            }}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleReset}>
            <Settings className="mr-2 h-4 w-4" />
            Reset Setup
          </Button>

          {onCancel && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    )
  }
)

/**
 * Validation Status Item Component
 * @param {object} props
 * @param {string} props.title - Status title
 * @param {string} props.description - Status description
 * @param {object} props.status - Status object
 */
const ValidationStatusItem = React.memo(({ title, description, status }) => {
  const getStatusIcon = () => {
    switch (status.type) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <div className="h-4 w-4 rounded-full bg-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusColor = () => {
    switch (status.type) {
      case "loading":
        return "text-blue-600"
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
      {getStatusIcon()}
      <div className="flex-1">
        <h5 className="text-sm font-medium text-gray-900">{title}</h5>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <span className={cn("text-sm font-medium", getStatusColor())}>
        {status.message}
      </span>
    </div>
  )
})

ValidationStatusItem.displayName = "ValidationStatusItem"
SetupIntegration.displayName = "SetupIntegration"

export default SetupIntegration
