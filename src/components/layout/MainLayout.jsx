import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"

import ModeToggle from "@/components/layout/header/ThemeSwitch"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import ct from "@constants/"

import AppSidebar from "./AppSidebar"
import LanguageNav from "./header/LanguageNav"
import UserNav from "./header/UserNav"

/**
 * MainLayout component renders the main application layout with sidebar, header, and content area.
 */
const MainLayout = () => {
  const store = useSelector((st) => st[ct.store.USER_STORE])
  const navigate = useNavigate()

  useEffect(() => {
    if (store.isAuthenticated) {
      return
    }
    // route to login page
    navigate(`/${ct.route.auth.LOGIN}`, { replace: true })
    navigate(`/${ct.route.auth.LOGIN}`, { replace: true })
  }, [store, navigate])

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        <div className="sticky top-0 z-50 w-full dark:shadow-secondary flex items-center justify-between p-4 bg-white dark:bg-[#020817] border-b dark:border-slate-800">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <LanguageNav />
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
