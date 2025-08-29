import {
  Eye,
  Database,
  GitGraph,
  History,
  Settings,
  Github,
} from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { ReactQueryDevtools } from "@/lib/devtools"
import ModeToggle from "@/components/layout/header/ThemeSwitch"
import { SparklesText } from "@/components/magicui/sparkles-text"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import ct from "@constants"

import AppSidebar from "./AppSidebar"
import DevelopmentToolButton from "./DevelopmentToolButton"
import EventsHistorySheet from "./sheets/EventsHistorySheet"
import SettingsSheet from "./sheets/SettingsSheet"
import ViewGraphSheet from "./sheets/ViewGraphSheet"
import ViewMemorySheet from "./sheets/ViewMemorySheet"
import ViewStateSheet from "./sheets/ViewStateSheet"

/**
 * MainLayout component renders the main application layout with sidebar, header, and content area.
 * Includes developer tools: View State, View Memory, View Graph, and Events History.
 * Dev tools are disabled when backend URL is not configured.
 */
const MainLayout = () => {
  const [activeSheet, setActiveSheet] = useState(null)
  const store = useSelector((st) => st[ct.store.SETTINGS_STORE])

  const { isVerified } = store.verification

  const handleSheetOpen = (sheetType) => {
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
              <span
                className="cursor-pointer"
                onClick={() => (window.location.pathname = "/")}
                tabIndex={0}
                role="button"
                aria-label="Go to home page"
              >
                <SparklesText className="text-lg">
                  PyAgenity Playground
                </SparklesText>
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <DevelopmentToolButton
                icon={Eye}
                tooltip="View State"
                handleActivate={() => handleSheetOpen("state")}
                isActive={activeSheet === "state"}
                disabled={!isVerified}
              />
              <DevelopmentToolButton
                icon={Database}
                tooltip="View Memory"
                handleActivate={() => handleSheetOpen("memory")}
                isActive={activeSheet === "memory"}
                disabled={!isVerified}
              />
              <DevelopmentToolButton
                icon={GitGraph}
                tooltip="View Graph"
                handleActivate={() => handleSheetOpen("graph")}
                isActive={activeSheet === "graph"}
                disabled={!isVerified}
              />
              <DevelopmentToolButton
                icon={History}
                tooltip="Events History"
                handleActivate={() => handleSheetOpen("history")}
                isActive={activeSheet === "history"}
                disabled={!isVerified}
              />
              <Separator orientation="vertical" className="h-6" />
              <DevelopmentToolButton
                icon={Settings}
                tooltip="Settings"
                handleActivate={() => handleSheetOpen("settings")}
                isActive={activeSheet === "settings"}
                disabled={false}
              />
              <ModeToggle />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex text-sm text-gray-500 dark:text-gray-400">
                <Github />{" "}
                <span className="ml-1">
                  <a
                    href="https://github.com/Iamsdt/PyAgenity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    PyAgenity
                  </a>
                </span>
              </div>
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
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-left" />
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default MainLayout
