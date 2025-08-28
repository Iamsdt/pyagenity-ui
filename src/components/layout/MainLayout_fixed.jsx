/* eslint-disable no-undef */
import { Eye, Database, GitGraph, History, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"

import ModeToggle from "@/components/layout/header/ThemeSwitch"
import { SparklesText } from "@/components/magicui/sparkles-text"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { isBackendConfigured } from "@/lib/settingsUtils"

import AppSidebar from "./AppSidebar"
import DevelopmentToolButton from "./DevelopmentToolButton"
import EventsHistorySheet from "./sheets/EventsHistorySheet"
import SettingsSheet from "./sheets/SettingsSheet"
import ViewGraphSheet from "./sheets/ViewGraphSheet"
import ViewMemorySheet from "./sheets/ViewMemorySheet"
import ViewStateSheet from "./sheets/ViewStateSheet"

/**
 * Custom hook for managing backend configuration state
 */
const useBackendConfig = () => {
  const [backendConfigured, setBackendConfigured] = useState(false)

  useEffect(() => {
    const checkBackendConfig = () => {
      setBackendConfigured(isBackendConfigured())
    }
    
    checkBackendConfig()
    
    // Listen for settings changes
    const handleStorageChange = () => {
      checkBackendConfig()
    }
    
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
      window.addEventListener("settingsUpdated", handleStorageChange)
      
      return () => {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("settingsUpdated", handleStorageChange)
      }
    }
    
    return undefined
  }, [])

  return backendConfigured
}

/**
 * MainLayout component renders the main application layout with sidebar, header, and content area.
 * Includes developer tools: View State, View Memory, View Graph, and Events History.
 * Dev tools are disabled when backend URL is not configured.
 */
const MainLayout = () => {
  const [activeSheet, setActiveSheet] = useState(null)
  const backendConfigured = useBackendConfig()

  const handleSheetOpen = (sheetType) => {
    // Check if dev tools require backend configuration
    if (
      ["state", "memory", "graph", "history"].includes(sheetType) &&
      !backendConfigured
    ) {
      return // Don't open development sheets if backend not configured
    }
    setActiveSheet(sheetType)
  }

  const handleSheetClose = () => {
    setActiveSheet(null)
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="min-h-screen w-full">
          <div className="sticky top-0 z-50 w-full dark:shadow-secondary flex items-center justify-between p-4 bg-white dark:bg-[#020817] border-b dark:border-slate-800">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <SparklesText className="text-lg">
                PyAgenity Playground
              </SparklesText>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <DevelopmentToolButton
                icon={Eye}
                tooltip="View State"
                handleActivate={() => handleSheetOpen("state")}
                isActive={activeSheet === "state"}
                disabled={!backendConfigured}
              />
              <DevelopmentToolButton
                icon={Database}
                tooltip="View Memory"
                handleActivate={() => handleSheetOpen("memory")}
                isActive={activeSheet === "memory"}
                disabled={!backendConfigured}
              />
              <DevelopmentToolButton
                icon={GitGraph}
                tooltip="View Graph"
                handleActivate={() => handleSheetOpen("graph")}
                isActive={activeSheet === "graph"}
                disabled={!backendConfigured}
              />
              <DevelopmentToolButton
                icon={History}
                tooltip="Events History"
                handleActivate={() => handleSheetOpen("history")}
                isActive={activeSheet === "history"}
                disabled={!backendConfigured}
              />
              <DevelopmentToolButton
                icon={Settings}
                tooltip="Settings"
                handleActivate={() => handleSheetOpen("settings")}
                isActive={activeSheet === "settings"}
                disabled={false}
              />
              <ModeToggle />
            </div>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
          <ViewStateSheet
            isOpen={activeSheet === "state"}
            onClose={handleSheetClose}
          />
          <ViewMemorySheet
            isOpen={activeSheet === "memory"}
            onClose={handleSheetClose}
          />
          <ViewGraphSheet
            isOpen={activeSheet === "graph"}
            onClose={handleSheetClose}
          />
          <EventsHistorySheet
            isOpen={activeSheet === "history"}
            onClose={handleSheetClose}
          />
          <SettingsSheet
            isOpen={activeSheet === "settings"}
            onClose={handleSheetClose}
          />
          <Toaster />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default MainLayout
