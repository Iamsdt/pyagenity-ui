import { zodResolver } from "@hookform/resolvers/zod"
import { Settings } from "lucide-react"
import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  selectSettings,
  setSettings,
} from "@/services/store/slices/settings.slice"

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
 * Custom hook for managing settings form
 */
const useSettingsForm = (isOpen, onClose) => {
  const dispatch = useDispatch()
  const currentSettings = useSelector(selectSettings)
  
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      backendUrl: "",
      authToken: "",
    },
  })

  const { setValue, reset } = form

  // Load settings from Redux when component mounts or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setValue("name", currentSettings.name)
      setValue("backendUrl", currentSettings.backendUrl)
      setValue("authToken", currentSettings.authToken)
      reset(currentSettings)
    }
  }, [isOpen, setValue, reset, currentSettings])

  const onSubmit = (data) => {
    dispatch(setSettings(data))
    onClose()
  }

  const handleCancel = () => {
    // Reset form to current Redux state
    reset(currentSettings)
    onClose()
  }

  return {
    ...form,
    onSubmit,
    handleCancel,
  }
}

/**
 * SettingsSheet component displays application settings form
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the sheet is open
 * @param {Function} props.onClose - Function to close the sheet
 * @returns {object} Sheet component displaying settings form
 */
const SettingsSheet = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    onSubmit,
    handleCancel,
  } = useSettingsForm(isOpen, onClose)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Agent Settings
          </SheetTitle>
          <SheetDescription>Configure your agent</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Agent name"
                {...register("name")}
                className="w-full"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your display name
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backend-url">Backend URL</Label>
              <Input
                id="backend-url"
                type="url"
                placeholder="https://api.example.com"
                {...register("backendUrl")}
                className="w-full"
              />
              {errors.backendUrl && (
                <p className="text-sm text-red-500">
                  {errors.backendUrl.message}
                </p>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter the base URL for your backend API
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-token">
                Authentication Token (Optional)
              </Label>
              <Input
                id="auth-token"
                type="password"
                placeholder="Bearer token or API key"
                {...register("authToken")}
                className="w-full"
              />
              {errors.authToken && (
                <p className="text-sm text-red-500">
                  {errors.authToken.message}
                </p>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your API authentication token (if required)
              </p>
            </div>
          </div>
          <SheetFooter className="mt-8">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty} className="ml-2">
              Save Settings
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

SettingsSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SettingsSheet
