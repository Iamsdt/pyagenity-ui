import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Eye, Database, GitGraph, History } from "lucide-react"

import ModeToggle from "@/components/layout/header/ThemeSwitch"
import { SparklesText } from "@/components/magicui/sparkles-text"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

import AppSidebar from "./AppSidebar"
import UserNav from "./header/UserNav"

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

  const DevToolButton = ({ icon: Icon, tooltip, onClick, isActive }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 ${
            isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
          }`}
          aria-label={tooltip}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )

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
              <DevToolButton
                icon={Eye}
                tooltip="View State"
                onClick={() => handleSheetOpen('state')}
                isActive={activeSheet === 'state'}
              />
              <DevToolButton
                icon={Database}
                tooltip="View Memory"
                onClick={() => handleSheetOpen('memory')}
                isActive={activeSheet === 'memory'}
              />
              <DevToolButton
                icon={GitGraph}
                tooltip="View Graph"
                onClick={() => handleSheetOpen('graph')}
                isActive={activeSheet === 'graph'}
              />
              <DevToolButton
                icon={History}
                tooltip="Events History"
                onClick={() => handleSheetOpen('history')}
                isActive={activeSheet === 'history'}
              />
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <ModeToggle />
            </div>
          </div>
          <div className="p-6 dark:bg-[#020817]">
            <Toaster />
            <Outlet />
          </div>

          {/* View State Sheet */}
          <Sheet open={activeSheet === 'state'} onOpenChange={(open) => !open && handleSheetClose()}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Application State</SheetTitle>
                <SheetDescription>
                  View and inspect the current application state
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg dark:border-slate-700">
                    <h3 className="font-medium mb-2">Redux Store</h3>
                    <pre className="text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded">
                      {JSON.stringify({ theme: 'dark', user: 'authenticated' }, null, 2)}
                    </pre>
                  </div>
                  <div className="p-4 border rounded-lg dark:border-slate-700">
                    <h3 className="font-medium mb-2">Component State</h3>
                    <pre className="text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded">
                      {JSON.stringify({ activeSheet: activeSheet, loading: false }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Memory Sheet */}
          <Sheet open={activeSheet === 'memory'} onOpenChange={(open) => !open && handleSheetClose()}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Memory Usage</SheetTitle>
                <SheetDescription>
                  Monitor application memory usage and performance
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg dark:border-slate-700">
                    <h3 className="font-medium mb-2">Heap Memory</h3>
                    <div className="text-sm space-y-1">
                      <div>Used: 45.2 MB</div>
                      <div>Total: 128 MB</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg dark:border-slate-700">
                    <h3 className="font-medium mb-2">Component Count</h3>
                    <div className="text-sm">Active Components: 12</div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Graph Sheet */}
          <Sheet open={activeSheet === 'graph'} onOpenChange={(open) => !open && handleSheetClose()}>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Network Graph</SheetTitle>
                <SheetDescription>
                  Visualize application flow and network connections
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 h-full">
                <div className="h-full border rounded-lg dark:border-slate-700 p-4">
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <div className="text-center">
                      <GitGraph className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Graph visualization will be rendered here</p>
                      <p className="text-sm mt-2">Connect nodes, edges, and data flow</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Events History Sheet */}
          <Sheet open={activeSheet === 'history'} onOpenChange={(open) => !open && handleSheetClose()}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Events History</SheetTitle>
                <SheetDescription>
                  Track application events and user interactions
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="space-y-2">
                  {[
                    { time: '10:30:15', event: 'User logged in', type: 'auth' },
                    { time: '10:30:22', event: 'Theme changed to dark', type: 'ui' },
                    { time: '10:30:45', event: 'Sheet opened: View State', type: 'action' },
                    { time: '10:31:02', event: 'API call: /api/users', type: 'network' },
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg dark:border-slate-700 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.event}</span>
                        <span className="text-slate-500">{item.time}</span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                        item.type === 'auth' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        item.type === 'ui' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        item.type === 'action' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default MainLayout
