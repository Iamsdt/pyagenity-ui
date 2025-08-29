import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import ct from "@constants/"

export const pingAPI = createAsyncThunk(
  "settings/pingAPI",
  async ({ backendUrl, authToken }, { rejectWithValue }) => {
    try {
      const response = await pingBackend(backendUrl, authToken)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
