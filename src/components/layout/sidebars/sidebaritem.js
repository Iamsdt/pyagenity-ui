const icon = "<Grid2X2 />"
const completeJD = "Completed-JD"

const sidebarBarItems = [
  {
    id: "Home-Dashboard",
    title: "Dashboard",
    icon: icon,
    navLink: "/",
  },
  {
    id: "Manage-JD",
    title: "Manage JD",
    icon: icon,
    navLink: "/post",
    children: [
      {
        id: completeJD,
        title: completeJD,
        navLink: "/post",
      },
      {
        id: "Inprogress-JD",
        title: "Inprogress JD",
        navLink: "/post",
      },
    ],
  },
]

export default sidebarBarItems
