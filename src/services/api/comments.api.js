import ct from "@constants/"

import api from "./index"

/**
 * Fetches comments from the API.
 *
 * Makes a GET request to the comments endpoint defined in the constants.
 * @async
 * @function
 * @returns {Promise} The response from the API containing the comments data.
 */
export async function getComments() {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }
  return api.get(ct.api.comment.comment, config)
}
