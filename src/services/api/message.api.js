import api from "./index"

/**
 * Put messages into a thread (store messages)
 * POST /v1/threads/{thread_id}/messages
 * @param {string|number} thread_id - ID of the thread
 * @param {object} body - Body matching PutMessagesSchema { messages: [...], config?, metadata? }
 */
export const putMessages = async (thread_id, body) => {
  return await api.post(`/v1/threads/${thread_id}/messages`, body)
}

/**
 * List messages from a thread with optional filters
 * GET /v1/threads/{thread_id}/messages
 * @param {string|number} thread_id - ID of the thread
 * @param {object} parameters - Optional query params { search, offset, limit }
 */
export const listMessages = async (thread_id, parameters = {}) => {
  const query = {}
  if (parameters.search !== undefined) query.search = parameters.search
  if (parameters.offset !== undefined) query.offset = parameters.offset
  if (parameters.limit !== undefined) query.limit = parameters.limit

  return await api.get(`/v1/threads/${thread_id}/messages`, { params: query })
}

/**
 * Get a specific message by id
 * GET /v1/threads/{thread_id}/messages/{message_id}
 * @param {string|number} thread_id - ID of the thread
 * @param {string|number} message_id - ID of the message
 */
export const getMessage = async (thread_id, message_id) => {
  return await api.get(`/v1/threads/${thread_id}/messages/${message_id}`)
}

/**
 * Delete a specific message
 * DELETE /v1/threads/{thread_id}/messages/{message_id}
 * @param {string|number} thread_id - ID of the thread
 * @param {string|number} message_id - ID of the message
 */
export const deleteMessage = async (thread_id, message_id) => {
  return await api.delete(`/v1/threads/${thread_id}/messages/${message_id}`)
}

export default {
  putMessages,
  listMessages,
  getMessage,
  deleteMessage,
}
