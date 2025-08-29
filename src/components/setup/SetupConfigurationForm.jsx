/* eslint-disable react/prop-types, complexity */
import { AlertCircle, Globe, User, ExternalLink } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * Setup Configuration Form Component
 *
 * Professional form for configuring backend URL and agent name
 * Features:
 * - Real-time validation
 * - URL format validation
 * - Professional design with Shadcn components
 * - Accessibility support
 * - Loading states
 * @param {object} props
 * @param {object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onFieldChange - Field change handler (optional)
 * @param {string} props.className - Additional CSS classes
 */
const SetupConfigurationForm = React.memo(
  ({
    initialValues = { backendUrl: "", agentName: "" },
    onSubmit,
    isLoading = false,
    error = null,
    onFieldChange,
    className,
    ...properties
  }) => {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isValid },
      setValue,
      trigger,
    } = useForm({
      defaultValues: initialValues,
      mode: "onChange",
    })

    // Watch form values for real-time validation
    const watchedValues = watch()

    /**
     * Handle form submission
     * @param {object} data - Form data
     */
    const handleFormSubmit = (data) => {
      if (onSubmit && typeof onSubmit === "function") {
        onSubmit(data)
      }
    }

    /**
     * Handle field changes and notify parent
     * @param {string} fieldName
     * @param {string} value
     */
    const handleFieldChange = (fieldName, value) => {
      setValue(fieldName, value)
      trigger(fieldName)

      if (onFieldChange && typeof onFieldChange === "function") {
        onFieldChange(fieldName, value)
      }
    }

    /**
     * Validate URL format
     * @param {string} url
     * @returns {boolean|string}
     */
    const validateUrl = (url) => {
      if (!url || url.trim() === "") {
        return "Backend URL is required"
      }

      const trimmedUrl = url.trim()

      // Basic URL pattern validation
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i
      const localhostPattern =
        /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:[0-9]+)?(\/.*)?$/i
      const ipPattern =
        /^(https?:\/\/)?([0-9]{1,3}\.){3}[0-9]{1,3}(:[0-9]+)?(\/.*)?$/i

      if (
        !urlPattern.test(trimmedUrl) &&
        !localhostPattern.test(trimmedUrl) &&
        !ipPattern.test(trimmedUrl)
      ) {
        return "Please enter a valid URL (e.g., https://api.example.com or localhost:8000)"
      }

      return true
    }

    /**
     * Validate agent name
     * @param {string} name
     * @returns {boolean|string}
     */
    const validateAgentName = (name) => {
      if (!name || name.trim() === "") {
        return "Agent name is required"
      }

      const trimmedName = name.trim()

      if (trimmedName.length < 2) {
        return "Agent name must be at least 2 characters long"
      }

      if (trimmedName.length > 50) {
        return "Agent name must be less than 50 characters"
      }

      // Allow alphanumeric, spaces, hyphens, and underscores
      const namePattern = /^[a-zA-Z0-9\s_-]+$/
      if (!namePattern.test(trimmedName)) {
        return "Agent name can only contain letters, numbers, spaces, hyphens, and underscores"
      }

      return true
    }

    return (
      <Card
        className={cn("w-full max-w-2xl mx-auto", className)}
        {...properties}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Configure Integration
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Set up your backend connection and agent configuration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Backend URL Field */}
            <div className="space-y-2">
              <Label
                htmlFor="backendUrl"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Backend URL
              </Label>
              <div className="relative">
                <Input
                  id="backendUrl"
                  type="url"
                  placeholder="https://api.example.com or localhost:8000"
                  disabled={isLoading}
                  className={cn(
                    "pl-3 pr-10",
                    errors.backendUrl && "border-red-500 focus:ring-red-500"
                  )}
                  {...register("backendUrl", {
                    validate: validateUrl,
                    onChange: (e) =>
                      handleFieldChange("backendUrl", e.target.value),
                  })}
                />
                {watchedValues.backendUrl && (
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
              </div>
              {errors.backendUrl && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.backendUrl.message}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Enter the base URL of your backend server (e.g.,
                https://api.example.com, localhost:3000)
              </p>
            </div>

            {/* Agent Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="agentName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Agent Name
              </Label>
              <Input
                id="agentName"
                type="text"
                placeholder="My AI Agent"
                disabled={isLoading}
                className={cn(
                  errors.agentName && "border-red-500 focus:ring-red-500"
                )}
                {...register("agentName", {
                  validate: validateAgentName,
                  onChange: (e) =>
                    handleFieldChange("agentName", e.target.value),
                })}
              />
              {errors.agentName && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.agentName.message}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Choose a descriptive name for your AI agent (2-50 characters)
              </p>
            </div>

            {/* Global Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="flex-1 h-11"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                    Validating...
                  </div>
                ) : (
                  "Continue Setup"
                )}
              </Button>
            </div>

            {/* Configuration Preview */}
            {watchedValues.backendUrl && watchedValues.agentName && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Configuration Preview
                </h4>
                <div className="space-y-1 text-xs text-blue-700">
                  <p>
                    <strong>Backend URL:</strong> {watchedValues.backendUrl}
                  </p>
                  <p>
                    <strong>Agent Name:</strong> {watchedValues.agentName}
                  </p>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    )
  }
)

SetupConfigurationForm.displayName = "SetupConfigurationForm"

export default SetupConfigurationForm

/**
 * Hook for managing setup configuration form state
 * @param {object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler
 */
export const useSetupConfigurationForm = (initialValues, onSubmit) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleSubmit = React.useCallback(
    async (data) => {
      setIsLoading(true)
      setError(null)

      try {
        if (onSubmit) {
          await onSubmit(data)
        }
      } catch (error_) {
        setError(error_.message || "Configuration failed")
      } finally {
        setIsLoading(false)
      }
    },
    [onSubmit]
  )

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    handleSubmit,
    clearError,
    setError,
  }
}
