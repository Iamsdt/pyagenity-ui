import api from "./index"

/**
 * List threads with optional filters
 * @param {object} parameters - Optional query params { search, offset, limit }
 */
export const listThreads = async (parameters = {}) => {
  const query = {}
  if (parameters.search !== undefined) query.search = parameters.search
  if (parameters.offset !== undefined) query.offset = parameters.offset
  if (parameters.limit !== undefined) query.limit = parameters.limit

  return await api.get("/v1/threads", { params: query })
}

/**
 * Get a single thread by id
 * @param {string|number} thread_id - ID of the thread to fetch
 */
export const getThread = async (thread_id) => {
  return await api.get(`/v1/threads/${thread_id}`)
}

/**
 * Delete a thread by id
 * @param {string|number} thread_id - ID of the thread to delete
 */
export const deleteThread = async (thread_id) => {
  return await api.delete(`/v1/threads/${thread_id}`)
}

export default {
  listThreads,
  getThread,
  deleteThread,
}
