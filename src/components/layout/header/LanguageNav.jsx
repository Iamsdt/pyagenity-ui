import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ct from "@constants/"
import { changeLocale } from "@store/slices/theme.slice"

/**
 * Returns the country flag emoji based on the current language.
 */
function getCountryFlag(current) {
  if (current === "en") {
    return <p>🇺🇸</p>
  }
  if (current === "hi") {
    return <p>🇮🇳</p>
  }
  return <p>🇺🇸</p>
}

/**
 * Returns the country flag emoji based on the current language.
 */
const LanguageNav = () => {
  const store = useSelector((st) => st[ct.store.THEME_STORE])
  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value)
    // update in store
    dispatch(changeLocale(value))
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                {getCountryFlag(store.local)}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Change Language</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">Change Language</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            asChild
            onClick={() => handleLanguageChange("en")}
          >
            <p>🇺🇸 {t("English")}</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            asChild
            onClick={() => handleLanguageChange("hi")}
          >
            <p>🇮🇳 Hindi</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageNav
