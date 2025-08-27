import { Users, Settings, SquarePen, LayoutGrid } from "lucide-react"

const POSTS_NEW_PATH = "/posts/new"

/**
 * Returns the dashboard menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The dashboard menu group object.
 */
function getDashboardMenuGroup(pathname) {
  return {
    groupLabel: "",
    menus: [
      {
        href: "/",
        label: "Dashboard",
        active: pathname.includes("/dashboard"),
        icon: LayoutGrid,
        submenus: [],
      },
    ],
  }
}

/**
 * Returns the contents menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The contents menu group object.
 */
function getContentsMenuGroup(pathname) {
  return {
    groupLabel: "Contents",
    menus: [
      {
        href: "",
        label: "Posts",
        active: pathname.includes("/posts"),
        icon: SquarePen,
        submenus: [
          {
            href: "/posts",
            label: "All Posts",
            active: pathname === "/posts",
          },
          {
            href: POSTS_NEW_PATH,
            label: "New Post",
            active: pathname === POSTS_NEW_PATH,
          },
        ],
      },
    ],
  }
}

/**
 * Returns the settings menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The settings menu group object.
 */
function getSettingsMenuGroup(pathname) {
  return {
    groupLabel: "Settings",
    menus: [
      {
        href: "/users",
        label: "Users",
        active: pathname.includes("/users"),
        icon: Users,
        submenus: [],
      },
      {
        href: "/account",
        label: "Account",
        active: pathname.includes("/account"),
        icon: Settings,
        submenus: [],
      },
    ],
  }
}

/**
 * Returns the complete menu list configuration.
 * @param {string} pathname - The current pathname.
 * @returns {Array<object>} The array of menu group objects.
 */
export function getMenuList(pathname) {
  return [
    getDashboardMenuGroup(pathname),
    getContentsMenuGroup(pathname),
    getSettingsMenuGroup(pathname),
  ]
}
