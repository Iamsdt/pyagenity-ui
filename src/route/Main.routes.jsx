import Chat from "@/pages/chat"
import Comments from "@/pages/comments"
import ct from "@constants/"
import Dashboard from "@pages/dashboard"

const mainRoutes = [
  { path: ct.route.ROOT, element: <Dashboard /> },
  { path: ct.route.dashboard.COMMENTS, element: <Comments /> },
  { path: "/chat", element: <Chat /> },
]

export default mainRoutes
