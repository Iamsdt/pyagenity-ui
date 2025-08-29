/* eslint-disable no-undef, complexity */
import axios from "axios"

/**
 * Setup Integration API Service
 *
 * Handles API calls for setup validation including:
 * - Backend connectivity verification (v1/ping)
 * - Graph data fetching (v1/graph)
 * - Proper error handling and timeout management
 * - URL validation and sanitization
 */

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000 // 10 seconds

/**
 * Validates and normalizes a backend URL
 * @param {string} url - The backend URL to validate
 * @returns {string} - Normalized URL
 * @throws {Error} - If URL is invalid
 */
const validateAndNormalizeUrl = (url) => {
  if (!url || typeof url !== "string") {
    throw new Error("Backend URL is required")
  }

  let normalizedUrl = url.trim()

  // Add protocol if missing
  if (
    !normalizedUrl.startsWith("http://") &&
    !normalizedUrl.startsWith("https://")
  ) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  // Remove trailing slash
  normalizedUrl = normalizedUrl.replace(/\/$/, "")

  // Validate URL format
  try {
    // Using URL constructor for validation
    new URL(normalizedUrl)
  } catch {
    throw new Error("Invalid backend URL format")
  }

  return normalizedUrl
}

/**
 * Creates an axios instance with custom configuration for setup validation
 * @param {string} baseURL - The backend base URL
 * @param {string} authToken - Optional authentication token
 * @returns {object} - Configured axios instance
 */
const createApiInstance = (baseURL, authToken = null) => {
  const normalizedBaseURL = validateAndNormalizeUrl(baseURL)

  const instance = axios.create({
    baseURL: normalizedBaseURL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  // Add auth token if provided
  if (authToken) {
    instance.defaults.headers.common.Authorization = `Bearer ${authToken}`
  }

  return instance
}

/**
 * Handle API errors with specific error messages
 * @param {Error} error - The error object
 * @param {string} operation - The operation that failed
 * @returns {Error} - Formatted error
 */
const handleApiError = (error, operation) => {
  if (error.code === "ECONNABORTED") {
    return new Error(
      `Connection timeout after ${REQUEST_TIMEOUT / 1000} seconds`
    )
  }

  if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
    return new Error(
      "Could not connect to backend server. Please check the URL."
    )
  }

  if (error.response) {
    const { status } = error.response
    if (status === 401) {
      return new Error("Authentication failed. Please check your credentials.")
    }
    if (status === 403) {
      return new Error("Access forbidden. Please check your permissions.")
    }
    if (status === 404) {
      return new Error(
        `${operation} endpoint not found. Please verify the backend URL.`
      )
    }
    if (status >= 500) {
      return new Error("Backend server error. Please try again later.")
    }
    return new Error(`Backend returned error: ${status}`)
  }

  if (error.request) {
    return new Error(
      "No response from backend server. Please check your connection."
    )
  }

  return new Error(error.message || `Failed to ${operation.toLowerCase()}`)
}

/**
 * Ping the backend to verify connectivity
 * @param {string} backendUrl - The backend URL
 * @param {string} authToken - Optional authentication token
 * @returns {Promise<object>} - Ping result with status and response time
 */
export const pingBackend = async (backendUrl, authToken = null) => {
  try {
    const startTime = Date.now()
    const api = createApiInstance(backendUrl, authToken)

    const response = await api.get("/v1/ping")
    const responseTime = Date.now() - startTime

    return {
      success: true,
      status: response.status,
      responseTime,
      data: response.data,
      message: "Backend connection successful",
    }
  } catch (error) {
    throw handleApiError(error, "Ping")
  }
}

/**
 * Fetch graph data from the backend
 * @param {string} backendUrl - The backend URL
 * @param {string} authToken - Optional authentication token
 * @returns {Promise<object>} - Graph data and metadata
 */
export const fetchGraphData = async (backendUrl, authToken = null) => {
  try {
    const startTime = Date.now()
    const api = createApiInstance(backendUrl, authToken)

    const response = await api.get("/v1/graph")
    const responseTime = Date.now() - startTime

    // Validate graph data structure
    const graphData = response.data
    if (!graphData || typeof graphData !== "object") {
      throw new Error("Invalid graph data format received from backend")
    }

    return {
      success: true,
      status: response.status,
      responseTime,
      data: graphData,
      message: "Graph data fetched successfully",
      metadata: {
        fetchedAt: new Date().toISOString(),
        dataSize: JSON.stringify(graphData).length,
      },
    }
  } catch (error) {
    throw handleApiError(error, "Graph")
  }
}

/**
 * Perform complete backend validation (ping + graph)
 * @param {string} backendUrl - The backend URL
 * @param {string} authToken - Optional authentication token
 * @param {Function} onProgress - Progress callback (step, result)
 * @returns {Promise<object>} - Complete validation results
 */
export const validateBackendSetup = async (
  backendUrl,
  authToken = null,
  onProgress = null
) => {
  const results = {
    ping: null,
    graph: null,
    success: false,
    error: null,
  }

  try {
    // Step 1: Ping backend
    if (onProgress) {
      onProgress("ping", { loading: true })
    }

    try {
      results.ping = await pingBackend(backendUrl, authToken)
      if (onProgress) {
        onProgress("ping", { success: true, data: results.ping })
      }
    } catch (pingError) {
      results.error = `Ping failed: ${pingError.message}`
      if (onProgress) {
        onProgress("ping", { error: pingError.message })
      }
      throw pingError
    }

    // Step 2: Fetch graph data
    if (onProgress) {
      onProgress("graph", { loading: true })
    }

    try {
      results.graph = await fetchGraphData(backendUrl, authToken)
      if (onProgress) {
        onProgress("graph", { success: true, data: results.graph })
      }
    } catch (graphError) {
      results.error = `Graph fetch failed: ${graphError.message}`
      if (onProgress) {
        onProgress("graph", { error: graphError.message })
      }
      throw graphError
    }

    // Both validations successful
    results.success = true
    return results
  } catch (error) {
    results.error = error.message
    throw error
  }
}

/**
 * Test a backend URL format without making actual requests
 * @param {string} url - The URL to test
 * @returns {object} - Validation result
 */
export const testBackendUrl = (url) => {
  try {
    const normalizedUrl = validateAndNormalizeUrl(url)
    return {
      valid: true,
      normalizedUrl,
      message: "URL format is valid",
    }
  } catch (error) {
    return {
      valid: false,
      normalizedUrl: null,
      message: error.message,
    }
  }
}
