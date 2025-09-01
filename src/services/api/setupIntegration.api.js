import api from "./index"

/**
 * Ping the backend to verify connectivity
 * @returns {Promise<object>} - Ping result with status and response time
 */
export const pingBackend = async () => {
  return await api.get("v1/ping")
}

/**
 * Fetch graph data from the backend
 * @returns {Promise<object>} - Graph data and metadata
 */
export const fetchGraphData = async () => {
  return await api.get("/v1/graph")
}
