import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Eye, Database, GitGraph, History } from "lucide-react"

import ModeToggle from "@/components/layout/header/ThemeSwitch"
import { SparklesText } from "@/components/magicui/sparkles-text"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

import AppSidebar from "./AppSidebar"
import DevelopmentToolButton from "./DevelopmentToolButton"
import UserNav from "./header/UserNav"
import EventsHistorySheet from "./sheets/EventsHistorySheet"
import ViewGraphSheet from "./sheets/ViewGraphSheet"
import ViewMemorySheet from "./sheets/ViewMemorySheet"
import ViewStateSheet from "./sheets/ViewStateSheet"

/**
 * MainLayout component renders the main application layout with sidebar, header, and content area.
 * Includes developer tools: View State, View Memory, View Graph, and Events History.
 */
const MainLayout = () => {
  const [activeSheet, setActiveSheet] = useState(null)

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
              />
              <DevelopmentToolButton
                icon={Database}
                tooltip="View Memory"
                handleActivate={() => handleSheetOpen("memory")}
                isActive={activeSheet === "memory"}
              />
              <DevelopmentToolButton
                icon={GitGraph}
                tooltip="View Graph"
                handleActivate={() => handleSheetOpen("graph")}
                isActive={activeSheet === "graph"}
              />
              <DevelopmentToolButton
                icon={History}
                tooltip="Events History"
                handleActivate={() => handleSheetOpen("history")}
                isActive={activeSheet === "history"}
              />
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <ModeToggle />
            </div>
          </div>
          <div className="p-6 dark:bg-[#020817]">
            <Toaster />
            <Outlet />
          </div>

          {/* Development Tool Sheets */}
          <ViewStateSheet
            isOpen={activeSheet === "state"}
            handleClose={handleSheetClose}
            activeSheet={activeSheet}
          />
          <ViewMemorySheet
            isOpen={activeSheet === "memory"}
            handleClose={handleSheetClose}
          />
          <ViewGraphSheet
            isOpen={activeSheet === "graph"}
            handleClose={handleSheetClose}
          />
          <EventsHistorySheet
            isOpen={activeSheet === "history"}
            handleClose={handleSheetClose}
          />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default MainLayout
