import { createBrowserRouter } from "react-router-dom"

import MainLayout from "@/components/layout/MainLayout"
import ct from "@constants/"

import dashboardRoutes from "./Main.routes"

const router = createBrowserRouter([
  {
    path: ct.route.ROOT,
    element: <MainLayout />,
    children: dashboardRoutes,
  },
])

export default router
