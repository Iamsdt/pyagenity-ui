import ct from "@constants/"

/**
 * Get the layout type based on the provided match.
 * If the match is not found, return the default layout type.
 * @param {Array} match - The array of matches to determine the layout type.
 * @returns {string} The layout type based on the match or the default layout type.
 */
export const getLayoutType = (match) => {
  const layoutType = match[match.length - 1].staticData?.layoutType
  if (layoutType) {
    return layoutType
  }
  return ct.layout.LAYOUT_TYPE_BLANK
}

export const getAuthRequirements = (match) => {
  if (match.length === 0) {
    return false
  }
  const result = match[match.length - 1].staticData?.isAuthRequired ?? null
  return result == null ? false : result
}

/**
 * Get the layout based on type.
 * If match not found then it will return true
 * then check that is the current path is in AUTH_NOT_REQUIRED not required list
 * now check is user authenticated
 * otherwise route to login page
 * @param {Array} matches - The array of matches to determine the layout type.
 * @param {string} pathname - Current Path Name
 * @param {Function} navigate - router navigate hook
 * @param {boolean} isAuthenticated - is user authenticated
 */
export const handleLoginRedirect = (
  matches,
  pathname,
  navigate,
  isAuthenticated
) => {
  // if user already authenticated nothing required
  if (isAuthenticated) {
    return
  }

  // check if the current path is in AUTH_NOT_REQUIRED, then we will skip
  const authNotRequired = [ct.route.auth.LOGIN, ct.route.auth.SINGUP]
  if (authNotRequired.includes(pathname)) {
    return
  }

  const authRequired = getAuthRequirements(matches)
  // if auth not required then nothing to do
  if (!authRequired) {
    return
  }

  // now navigate
  navigate({ to: ct.route.auth.LOGIN, replace: true })
}
