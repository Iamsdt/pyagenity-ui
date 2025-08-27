import { createBrowserRouter } from "react-router-dom"

import BlankLayout from "@/components/layout/BlankLayout"
import MainLayout from "@/components/layout/MainLayout"
import ct from "@constants/"

import blankRoutes from "./Blank.routes"
import dashboardRoutes from "./Main.routes"

const router = createBrowserRouter([
  {
    path: ct.route.ROOT,
    element: <MainLayout />,
    children: dashboardRoutes,
  },
  {
    element: <BlankLayout />,
    children: blankRoutes,
  },
])

export default router
