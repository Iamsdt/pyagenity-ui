import axios from "axios"

const INVALID_URL_ERROR = "Invalid URL format"

/**
 * API Validation Service for backend connectivity testing
 * Validates v1/ping and v1/graph endpoints
 */
class ApiValidationService {
  /**
   * Validates backend URL format
   * @param {string} url - Backend URL to validate
   * @returns {boolean} - True if URL is valid
   */
  static isValidUrl(url) {
    try {
      const urlObject = new globalThis.URL(url)
      return urlObject.protocol === "http:" || urlObject.protocol === "https:"
    } catch {
      return false
    }
  }

  /**
   * Creates axios instance with proper configuration
   * @param {string} baseURL - Backend base URL
   * @param {string} authToken - Optional auth token
   * @returns {object} - Configured axios instance
   */
  static createApiClient(baseURL, authToken = "") {
    const config = {
      baseURL: baseURL.endsWith("/") ? baseURL : `${baseURL}/`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (authToken && authToken.trim()) {
      config.headers.Authorization = authToken.startsWith("Bearer ")
        ? authToken
        : `Bearer ${authToken}`
    }

    return axios.create(config)
  }

  /**
   * Tests backend connectivity by hitting v1/graph endpoint
   * @param {string} baseURL - Backend base URL
   * @param {string} authToken - Optional auth token
   * @returns {Promise<object>} - Ping test result
   */
  static async testPingEndpoint(baseURL, authToken = "") {
    try {
      if (!this.isValidUrl(baseURL)) {
        throw new Error(INVALID_URL_ERROR)
      }

      const apiClient = this.createApiClient(baseURL, authToken)
      // Use v1/graph endpoint to test connectivity since v1/ping doesn't exist
      const response = await apiClient.get("v1/graph")

      return {
        success: true,
        data: response.data,
        status: response.status,
        message: "Backend connection successful",
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        status: error.response?.status || 0,
        message:
          error.response?.data?.message || error.message || "Connection failed",
      }
    }
  }

  /**
   * Tests v1/graph endpoint and retrieves graph data
   * @param {string} baseURL - Backend base URL
   * @param {string} authToken - Optional auth token
   * @returns {Promise<object>} - Graph test result
   */
  static async testGraphEndpoint(baseURL, authToken = "") {
    try {
      if (!this.isValidUrl(baseURL)) {
        throw new Error(INVALID_URL_ERROR)
      }

      const apiClient = this.createApiClient(baseURL, authToken)
      const response = await apiClient.get("v1/graph")

      return {
        success: true,
        data: response.data,
        status: response.status,
        message: "Graph data retrieved successfully",
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        status: error.response?.status || 0,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to retrieve graph data",
      }
    }
  }

  /**
   * Validates both endpoints sequentially
   * @param {string} baseURL - Backend base URL
   * @param {string} authToken - Optional auth token
   * @returns {Promise<object>} - Complete validation result
   */
  static async validateBackend(baseURL, authToken = "") {
    const results = {
      ping: { success: false, data: null, message: "", status: 0 },
      graph: { success: false, data: null, message: "", status: 0 },
      overallSuccess: false,
    }

    // Test ping endpoint first
    results.ping = await this.testPingEndpoint(baseURL, authToken)

    // Only test graph if ping is successful
    if (results.ping.success) {
      results.graph = await this.testGraphEndpoint(baseURL, authToken)
    } else {
      results.graph.message = "Skipped due to ping failure"
    }

    results.overallSuccess = results.ping.success && results.graph.success

    return results
  }
}

export default ApiValidationService
