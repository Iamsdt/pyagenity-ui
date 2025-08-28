/* eslint-disable no-undef */
import { createSlice } from "@reduxjs/toolkit"

const SETTINGS_STORAGE_KEY = "pyagenity-settings"

const initialState = {
    name: "",
    backendUrl: "",
    authToken: "",
    isBackendConfigured: false,
}

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state, action) => {
            const { name, backendUrl, authToken } = action.payload
            state.name = name || ""
            state.backendUrl = backendUrl || ""
            state.authToken = authToken || ""
            state.isBackendConfigured = Boolean(
                backendUrl && backendUrl.trim() !== ""
            )

            // Also save to localStorage for persistence
            if (typeof window !== "undefined") {
                try {
                    localStorage.setItem(
                        SETTINGS_STORAGE_KEY,
                        JSON.stringify({
                            name: state.name,
                            backendUrl: state.backendUrl,
                            authToken: state.authToken,
                        })
                    )
                    // Dispatch custom event for any other listeners
                    window.dispatchEvent(new CustomEvent("settingsUpdated"))
                } catch (error) {
                    console.error("Failed to save settings to localStorage:", error)
                }
            }
        },
        loadSettingsFromStorage: (state) => {
            if (typeof window !== "undefined") {
                try {
                    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
                    if (savedSettings) {
                        const parsed = JSON.parse(savedSettings)
                        state.name = parsed.name || ""
                        state.backendUrl = parsed.backendUrl || ""
                        state.authToken = parsed.authToken || ""
                        state.isBackendConfigured = Boolean(
                            parsed.backendUrl && parsed.backendUrl.trim() !== ""
                        )
                    }
                } catch (error) {
                    console.error("Failed to load settings from localStorage:", error)
                }
            }
        },
        clearSettings: (state) => {
            state.name = ""
            state.backendUrl = ""
            state.authToken = ""
            state.isBackendConfigured = false

            if (typeof window !== "undefined") {
                try {
                    localStorage.removeItem(SETTINGS_STORAGE_KEY)
                    window.dispatchEvent(new CustomEvent("settingsUpdated"))
                } catch (error) {
                    console.error("Failed to clear settings from localStorage:", error)
                }
            }
        },
    },
})

export const { setSettings, loadSettingsFromStorage, clearSettings } =
    settingsSlice.actions

// Selectors
export const selectSettings = (state) => state.settingsStore
export const selectIsBackendConfigured = (state) =>
    state.settingsStore.isBackendConfigured
export const selectBackendUrl = (state) => state.settingsStore.backendUrl
export const selectName = (state) => state.settingsStore.name
export const selectAuthToken = (state) => state.settingsStore.authToken

export default settingsSlice.reducer
