import ct from "@constants/"
import Chat from "@pages/chat"
import Dashboard from "@pages/dashboard"

const mainRoutes = [
  { path: ct.route.ROOT, element: <Dashboard /> },
  { path: ct.route.CHAT, element: <Chat /> },
  { path: ct.route.CHAT_THREAD, element: <Chat /> },
]

export default mainRoutes
