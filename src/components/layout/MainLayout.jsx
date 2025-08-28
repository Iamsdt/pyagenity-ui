import { Outlet } from "react-router-dom"

import ModeToggle from "@/components/layout/header/ThemeSwitch"
import { SparklesText } from "@/components/magicui/sparkles-text"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"

import AppSidebar from "./AppSidebar"
import UserNav from "./header/UserNav"

/**
 * MainLayout component renders the main application layout with sidebar, header, and content area.
 */
const MainLayout = () => {
  return (
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
            <ModeToggle />
            <UserNav />
          </div>
        </div>
        <div className="p-6 dark:bg-[#020817]">
          <Toaster />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default MainLayout
