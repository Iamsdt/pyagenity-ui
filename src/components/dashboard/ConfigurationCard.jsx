/* eslint-disable no-undef */
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageCircle, Settings } from "lucide-react"
import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SETTINGS_STORAGE_KEY = "pyagenity-settings"

// Zod validation schema
const settingsSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  backendUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Backend URL is required"),
  authToken: z.string().optional(),
})

/**
 * Load settings from localStorage
 * @returns {object} Settings object with name, backendUrl, and authToken
 */
const loadSettingsFromStorage = () => {
  if (typeof window === "undefined") {
    return { name: "", backendUrl: "", authToken: "" }
  }

  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      return {
        name: parsed.name || "",
        backendUrl: parsed.backendUrl || "",
        authToken: parsed.authToken || "",
      }
    } catch (error) {
      console.error("Failed to parse saved settings:", error)
    }
  }
  return {
    name: "",
    backendUrl: "",
    authToken: "",
  }
}

/**
 * Save settings to localStorage
 * @param {object} settings - Settings object to save
 */
const saveSettingsToStorage = (settings) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error("Failed to save settings:", error)
  }
}

/**
 * Custom hook for managing dashboard configuration form
 */
const useConfigurationForm = (onStartChat) => {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      backendUrl: "",
      authToken: "",
    },
  })

  const { setValue, reset, watch } = form
  const backendUrl = watch("backendUrl")
  const name = watch("name")
  const isReadyToChat = backendUrl && name

  // Load settings from localStorage when component mounts
  useEffect(() => {
    const savedSettings = loadSettingsFromStorage()
    setValue("name", savedSettings.name)
    setValue("backendUrl", savedSettings.backendUrl)
    setValue("authToken", savedSettings.authToken)
    reset(savedSettings)
  }, [setValue, reset])

  const handleFormSubmit = (data) => {
    saveSettingsToStorage(data)
    if (onStartChat) {
      onStartChat(data)
    }
  }

  const handleStartChat = () => {
    const currentValues = watch()
    if (currentValues.name && currentValues.backendUrl) {
      saveSettingsToStorage(currentValues)
      navigate("/chat")
    }
  }

  return {
    ...form,
    isReadyToChat,
    handleFormSubmit,
    handleStartChat,
  }
}

/**
 * ConfigurationCard component for dashboard setup
 * @param {object} props - Component props
 * @param {Function} props.onStartChat - Callback when Start Chat is clicked
 * @returns {object} Card component with configuration form
 */
const ConfigurationCard = ({ onStartChat = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    isReadyToChat,
    handleFormSubmit,
    handleStartChat,
  } = useConfigurationForm(onStartChat)

  return (
    <Card className="bg-white dark:bg-slate-900 shadow rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Agent Configuration
        </h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Set up Agent and its backend connection to get started
      </p>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dashboard-name" className="text-sm font-medium">
            Agent Name
          </Label>
          <Input
            id="dashboard-name"
            type="text"
            placeholder="Agent name"
            {...register("name")}
            className="w-full"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="dashboard-backend-url"
            className="text-sm font-medium"
          >
            Backend URL
          </Label>
          <Input
            id="dashboard-backend-url"
            type="url"
            placeholder="https://api.example.com"
            {...register("backendUrl")}
            className="w-full"
          />
          {errors.backendUrl && (
            <p className="text-xs text-red-500">{errors.backendUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dashboard-auth-token" className="text-sm font-medium">
            Auth Token (Optional)
          </Label>
          <Input
            id="dashboard-auth-token"
            type="password"
            placeholder="Bearer token or API key"
            {...register("authToken")}
            className="w-full"
          />
          {errors.authToken && (
            <p className="text-xs text-red-500">{errors.authToken.message}</p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            onClick={handleStartChat}
            disabled={!isReadyToChat}
            size="sm"
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Chat
          </Button>
        </div>
      </form>
    </Card>
  )
}

ConfigurationCard.propTypes = {
  onStartChat: PropTypes.func,
}

ConfigurationCard.defaultProps = {
  onStartChat: null,
}

export default ConfigurationCard
